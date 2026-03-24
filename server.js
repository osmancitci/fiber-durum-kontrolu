const express = require("express");
const axios = require("axios");
const qs = require("qs");
const path = require("path");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;


function getConfig() {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, "config.json"));
        return JSON.parse(rawData);
    } catch (err) {
        console.error("config.json okunamadı:", err);
        return { binaId: "", daireId: "", dakika: 2 };
    }
}

// ====== Ana route ======
app.get("/", async (req, res) => {
    const { binaId, daireId, dakika } = getConfig();
    try {
        // 1️⃣ Token al
        const resToken = await axios.get("https://www.milleni.com.tr/internet-altyapi-sorgulama");
        const cookies = resToken.headers["set-cookie"];
        const tokenMatch = resToken.data.match(/name="__RequestVerificationToken".*value="(.*?)"/);
        const verificationToken = tokenMatch[1];

        // 2️⃣ Daireleri çek
        const dairelerRes = await axios.post(
            "https://www.milleni.com.tr/GetIndependentParts",
            qs.stringify({ __RequestVerificationToken: verificationToken, buildingId: binaId }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookies.join(";") } }
        );

        let daireler = dairelerRes.data;

        if (daireId) {
            daireler = daireler.filter(d => d.Id.toString() === daireId);
            if (daireler.length === 0) {
                return res.render("index", { binaId, tekDaire: true, daireDurumlar: [], fiberBinadaVar: false, error: "Daire bulunamadı", dakika });
            }
        }

        const daireDurumlar = [];
        let fiberBinadaVar = false;

        for (const daire of daireler) {
            const bbk = daire.IdString;
            const response = await axios.post(
                "https://www.milleni.com.tr/internet-altyapi-sorgulama",
                qs.stringify({ __RequestVerificationToken: verificationToken, bbk, buildingId: binaId }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookies.join(";") } }
            );

            const data = response.data;
            const maxSpeed = parseInt(data.maxSpeed || "0", 10);
            const ttServiceTypes = data.ttServiceTypes || "";
            const fiber = ttServiceTypes.includes("V1") || maxSpeed >= 1000;
            if (fiber) fiberBinadaVar = true;

            daireDurumlar.push({
                id: daire.Id,
                name: daire.Name,
                speed: maxSpeed,
                service: ttServiceTypes,
                fiber
            });
        }

        // ID sırasına göre sırala
        daireDurumlar.sort((a,b)=>a.id-b.id);

        res.render("index", { binaId, tekDaire: !!daireId, daireDurumlar, fiberBinadaVar, error: null, dakika, sonYenileme: new Date() });
    } catch (err) {
        res.render("index", { binaId, tekDaire: !!daireId, daireDurumlar: [], fiberBinadaVar: false, error: err.message, dakika, sonYenileme: new Date() });
    }
});

// ====== JSON endpoint ======
app.get("/fiber.json", async (req, res) => {
    const { binaId, daireId, dakika } = getConfig();
    try {
        const resToken = await axios.get("https://www.milleni.com.tr/internet-altyapi-sorgulama");
        const cookies = resToken.headers["set-cookie"];
        const tokenMatch = resToken.data.match(/name="__RequestVerificationToken".*value="(.*?)"/);
        const verificationToken = tokenMatch[1];

        const dairelerRes = await axios.post(
            "https://www.milleni.com.tr/GetIndependentParts",
            qs.stringify({ __RequestVerificationToken: verificationToken, buildingId: binaId }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookies.join(";") } }
        );

        let daireler = dairelerRes.data;

        if (daireId) {
            daireler = daireler.filter(d => d.Id.toString() === daireId);
        }

        const daireDurumlar = [];
        let fiberBinadaVar = false;

        for (const daire of daireler) {
            const bbk = daire.IdString;
            const response = await axios.post(
                "https://www.milleni.com.tr/internet-altyapi-sorgulama",
                qs.stringify({ __RequestVerificationToken: verificationToken, bbk, buildingId: binaId }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookies.join(";") } }
            );

            const data = response.data;
            const maxSpeed = parseInt(data.maxSpeed || "0", 10);
            const ttServiceTypes = data.ttServiceTypes || "";
            const fiber = ttServiceTypes.includes("V1") || maxSpeed >= 1000;
            if (fiber) fiberBinadaVar = true;

            daireDurumlar.push({
                id: daire.Id,
                name: daire.Name,
                speed: maxSpeed,
                service: ttServiceTypes,
                fiber
            });
        }

        daireDurumlar.sort((a,b)=>a.id-b.id);

        res.json({ binaId, tekDaire: !!daireId, daireDurumlar, fiberBinadaVar, dakika, sonYenileme: new Date() });
    } catch (err) {
        res.json({ binaId, tekDaire: !!daireId, daireDurumlar: [], fiberBinadaVar: false, error: err.message, dakika, sonYenileme: new Date() });
    }
});

app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`));