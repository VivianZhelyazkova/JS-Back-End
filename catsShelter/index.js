import http from "http";
import fs from "node:fs/promises";
import homePageTemplate from "./views/index.html.js";
import addCatTemplate from "./views/addCat.html.js";
import addBreedTemplate from "./views/addBreed.html.js";
import siteCss from "./content/styles/site.css.js";
import { log } from "node:console";


const cats = await readCats();

const server = http.createServer((req, res) => {
    if (req.url === "/cats/add-cat" && req.method === "POST") {
        let newCat = "";
        req.on("data", (chunk) => {
            newCat += chunk;
        });
        req.on("end", () => {
            const data = new URLSearchParams(newCat);
            const result = Object.fromEntries(data.entries());
            writeCat(result).then(()=>{
                    res.writeHead(301,{
                        "location":"/"
                    })
                    res.end()
                }
            )

        });
        return
    }

    
    if (req.url === "/content/styles/site.css") {
        res.writeHead(200, {
            "content-type": "text/css",
        });
        res.write(siteCss);
        return res.end();
    }

    res.writeHead(200, {
        "content-type": "text/html",
    });
    switch (req.url) {
        case "/":
            res.write(homePageTemplate(cats));
            break;

        case "/cats/add-cat":
            res.write(addCatTemplate());
            break;

        case "/cats/add-breed":
            res.write(addBreedTemplate());
    }
    res.end();
});

async function readCats() {
    const catsJson = await fs.readFile("./cats.json", { encoding: "utf-8" });
    const cats = JSON.parse(catsJson);
    return cats;
}

async function writeCat(newCat){
    newCat.id = cats.lenght + 1
    cats.push(newCat)
    await fs.writeFile("./cats.json", JSON.stringify(cats,null, 4),{encoding: "utf-8"})
}

server.listen(5000);
console.log("Server is listening on http://localhost:5000...");
