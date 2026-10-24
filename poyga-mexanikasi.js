// BILIMDONLAR POYGASI
// Ball, javob tezligi va poygachi harakatini boshqarish

const PoygaMexanikasi = (() => {
    const MIN_TEZLIK = 2;
    const MAX_TEZLIK = 15;
    const ASOSIY_TEZLIK = 5;

    let poygachilar = {};
    let natijalar = [];

    // Yangi poygachini ro'yxatga olish
    function poygachiQoshish(id, ism) {
        if (!id) {
            throw new Error("Poygachi uchun ID kerak.");
        }

        poygachilar[id] = {
            id: id,
            ism: ism || "Poygachi",
            ball: 0,
            tezlik: ASOSIY_TEZLIK,
            masofa: 0,
            togriJavoblar: 0,
            xatoJavoblar: 0,
            javoblar: []
        };

        return { ...poygachilar[id] };
    }

    // Javobni tekshirish va ball hisoblash
    function javobniTekshirish({
        poygachiId,
        savolId,
        tanlanganJavob,
        togriJavob,
        sarflanganSoniya,
        ajratilganSoniya
    }) {
        const poygachi = poygachilar[poygachiId];

        if (!poygachi) {
            throw new Error("Poygachi topilmadi.");
        }

        const limit = Math.max(1, Number(ajratilganSoniya) || 20);
        const sarf = Math.max(0, Number(sarflanganSoniya) || 0);

        const vaqtQoldi = Math.max(0, limit - sarf);
        const vaqtIchida = sarf <= limit;

        // Javob indekslari yoki qiymatlari teng bo'lishi kerak.
        const togri =
            vaqtIchida &&
            String(tanlanganJavob) === String(togriJavob);

        let berilganBall = 0;
        let tezlikOzgarishi = 0;

        if (togri) {
            // Tez javob uchun ko'proq ball:
            // 10 ball bazaviy + qolgan vaqtga qarab bonus.
            berilganBall = Math.round(
                10 + (vaqtQoldi / limit) * 10
            );

            // To'g'ri javob bergan sari tezlashadi.
            tezlikOzgarishi = 1 + (vaqtQoldi / limit) * 2;

            poygachi.ball += berilganBall;
            poygachi.togriJavoblar++;
            poygachi.tezlik = Math.min(
                MAX_TEZLIK,
                poygachi.tezlik + tezlikOzgarishi
            );
        } else {
            // Xato yoki muddati o'tgan javob.
            poygachi.xatoJavoblar++;

            tezlikOzgarishi = -2;

            poygachi.tezlik = Math.max(
                MIN_TEZLIK,
                poygachi.tezlik + tezlikOzgarishi
            );
        }

        const natija = {
            poygachiId,
            ism: poygachi.ism,
            savolId,
            togri,
            berilganBall,
            tezlik: Number(poygachi.tezlik.toFixed(2)),
            masofa: Number(poygachi.masofa.toFixed(2)),
            sarflanganSoniya: sarf,
            vaqtQoldi,
            vaqtIchida,
            vaqt: new Date().toISOString()
        };

        poygachi.javoblar.push(natija);
        natijalar.push(natija);

        return {
            ...natija,
            umumiyBall: poygachi.ball,
            togriJavoblar: poygachi.togriJavoblar,
            xatoJavoblar: poygachi.xatoJavoblar
        };
    }

    // O'yin animatsiyasi uchun masofani yangilash.
    // deltaSeconds — oxirgi yangilanishdan o'tgan soniya.
    function harakatniYangilash(deltaSeconds) {
        const delta = Math.max(
            0,
            Math.min(Number(deltaSeconds) || 0, 0.1)
        );

        Object.values(poygachilar).forEach(function (p) {
            p.masofa += p.tezlik * delta;
        });

        return reytingniOlish();
    }

    // Joriy reyting
    function reytingniOlish() {
        return Object.values(poygachilar)
            .sort((a, b) => b.masofa - a.masofa)
            .map((p, index) => ({
                orin: index + 1,
                id: p.id,
                ism: p.ism,
                ball: p.ball,
                tezlik: Number(p.tezlik.toFixed(2)),
                masofa: Number(p.masofa.toFixed(2)),
                togriJavoblar: p.togriJavoblar,
                xatoJavoblar: p.xatoJavoblar
            }));
    }

    // Barcha javoblar tarixini olish
    function javoblarTarixi() {
        return natijalar.map(n => ({ ...n }));
    }

    // O'yinni boshlashdan oldin holatni tozalash
    function qaytaBoshlash() {
        poygachilar = {};
        natijalar = [];
    }

    return {
        poygachiQoshish,
        javobniTekshirish,
        harakatniYangilash,
        reytingniOlish,
        javoblarTarixi,
        qaytaBoshlash
    };
})();

window.PoygaMexanikasi = PoygaMexanikasi;
