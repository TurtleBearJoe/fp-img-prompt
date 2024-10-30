// bookmarklet.js - Host this file on GitHub
(async function(){
    const delay = e => new Promise(t => setTimeout(t,e));
    const extractImageId = e => {
        const t = e.match(/production\/(\d+)\/render\.jpeg/);
        return t ? t[1] : null
    };
    const downloadImage = async(t,n) => {
        try {
            const c = await fetch(t);
            const i = await c.blob();
            const a = document.createElement("a");
            a.href = URL.createObjectURL(i);
            a.download = n;
            a.click();
            URL.revokeObjectURL(a.href);
            await delay(500)
        } catch(e) {
            console.error(`Failed to download image: ${n}`,e)
        }
    };
    const copyToClipboard = async e => {
        try {
            await navigator.clipboard.writeText(e)
        } catch(e) {
            console.error("Failed to copy to clipboard:",e)
        }
    };
    async function processPage() {
        let i = [];
        const a = document.querySelectorAll("div.max-w-full:nth-child(n)");
        for(const r of a)try {
            const a = r.querySelector("div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)");
            const o = a?a.textContent.trim():"";
            const l = r.querySelectorAll(".selectable-item-target");
            for(const a of l)if(a.id.match(/^creation\d+$/)) {
                const r = a.src;
                const l = extractImageId(r);
                if(l) {
                    const t = a.closest("div").querySelector("div.opacity-100:nth-child(5) > div:nth-child(1) > button:nth-child(1)");
                    if(t) {
                        t.click();
                        await delay(500);
                        const d = document.querySelector("button.w-full:nth-child(1) > span:nth-child(2)");
                        if(d) {
                            d.click();
                            await delay(500);
                            const t = await navigator.clipboard.readText();
                            i.push(`${o}\t${l}.jpeg\t${t}`);
                            await downloadImage(r,`${l}.jpeg`)
                        }
                        document.body.click();
                        await delay(500)
                    }
                }
            }
        } catch(e) {
            console.error("Error processing group:",e)
        }
        i.length>0?(await copyToClipboard(i.join("\n")),alert(`Processed ${i.length} images. Data copied to clipboard.`)):alert("No images found to process.")
    }
    await processPage()
})();