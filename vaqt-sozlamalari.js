// BILIMDONLAR POYGASI
// Har bir savol uchun alohida vaqt sozlamalari

const SAVOL_VAQT_VARIANTLARI = [10, 20, 30];

const STANDART_VAQT = 20;

// Savol uchun vaqtni tanlash oynasini yaratish
function vaqtTanlashMaydoni(savolRaqami, tanlanganVaqt = STANDART_VAQT) {
    const container = document.createElement("div");

    container.className = "vaqt-sozlamasi";

    const label = document.createElement("label");
    label.textContent = `${savolRaqami}-savol uchun vaqt:`;

    const select = document.createElement("select");
    select.className = "savol-vaqti";
    select.dataset.savol = savolRaqami;

    SAVOL_VAQT_VARIANTLARI.forEach(function (soniya) {
        const option = document.createElement("option");

        option.value = soniya;
        option.textContent = `${soniya} soniya`;

        if (soniya === tanlanganVaqt) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    label.appendChild(select);
    container.appendChild(label);

    return container;
}

// Barcha savollar vaqtlarini olish
function barchaSavollarVaqtiniOlish() {
    const vaqtMaydonlari = document.querySelectorAll(".savol-vaqti");

    return Array.from(vaqtMaydonlari).map(function (maydon, index) {
        return {
            savolRaqami: index + 1,
            soniya: Number(maydon.value)
        };
    });
}

// Savollar va vaqtlarini saqlash
function savolVaqtlariniSaqlash(savollar) {
    const natija = savollar.map(function (savol, index) {
        return {
            ...savol,
            seconds: Number(
                savol.seconds || STANDART_VAQT
            )
        };
    });

    localStorage.setItem(
        "bilimdonlar_savollar",
        JSON.stringify(natija)
    );

    return natija;
}

// Savol uchun qolgan vaqt hisoblagichi
function savolTaymeriniBoshlash(soniya, yangilash, tugadi) {
    let qolganVaqt = Number(soniya);

    yangilash(qolganVaqt);

    const interval = setInterval(function () {
        qolganVaqt--;

        yangilash(Math.max(0, qolganVaqt));

        if (qolganVaqt <= 0) {
            clearInterval(interval);
            tugadi();
        }
    }, 1000);

    return function taymerniToxtatish() {
        clearInterval(interval);
    };
}

// Boshqa fayllardan foydalanish uchun
window.BilimdonVaqt = {
    variantlar: SAVOL_VAQT_VARIANTLARI,
    standartVaqt: STANDART_VAQT,
    vaqtTanlashMaydoni: vaqtTanlashMaydoni,
    barchaSavollarVaqtiniOlish: barchaSavollarVaqtiniOlish,
    savolVaqtlariniSaqlash: savolVaqtlariniSaqlash,
    savolTaymeriniBoshlash: savolTaymeriniBoshlash
};
