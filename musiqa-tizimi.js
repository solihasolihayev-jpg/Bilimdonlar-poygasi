// BILIMDONLAR POYGASI — MUSIQA TIZIMI
// Tashqi musiqa faylisiz elektron kuy va ovoz effektlari

const MusiqaTizimi = (() => {
    let audio = null;
    let asosiyOvoz = 0.35;
    let musiqaIntervali = null;
    let musiqaYoqilgan = false;
    let g'alaba = false;
    let notaIndeksi = 0;

    const notalar = [
        261.63, 329.63, 392.00, 523.25,
        392.00, 329.63, 440.00, 523.25,
        587.33, 523.25, 440.00, 392.00
    ];

    function audioOchish() {
        if (!audio) {
            const AudioContext =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContext) {
                throw new Error("Brauzeringiz audio tizimini qo‘llamaydi.");
            }

            audio = new AudioContext();
        }

        if (audio.state === "suspended") {
            return audio.resume();
        }

        return Promise.resolve();
    }

    function notaChalish(chastota, davomiylik = 0.22, shakl = "triangle") {
        if (!audio || audio.state !== "running") return;

        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.type = shakl;
        oscillator.frequency.value = chastota;

        gain.gain.setValueAtTime(0.001, audio.currentTime);
        gain.gain.linearRampToValueAtTime(
            asosiyOvoz * 0.20,
            audio.currentTime + 0.025
        );
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + davomiylik
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start();
        oscillator.stop(audio.currentTime + davomiylik + 0.03);
    }

    function poygaMusiqasiniBoshlash() {
        return audioOchish().then(() => {
            g'alaba = false;
            musiqaYoqilgan = true;

            if (musiqaIntervali) {
                clearInterval(musiqaIntervali);
            }

            musiqaIntervali = setInterval(() => {
                if (!musiqaYoqilgan || g'alaba) return;

                const chastota = notalar[notaIndeksi % notalar.length];

                notaChalish(chastota, 0.24, "triangle");

                // Pastki ohang poyga musiqasiga ritm beradi.
                if (notaIndeksi % 4 === 0) {
                    notaChalish(chastota / 2, 0.30, "sine");
                }

                notaIndeksi++;
            }, 260);
        });
    }

    function ovozEffekti(nom) {
        return audioOchish().then(() => {
            const effektlar = {
                start: [392, 523, 659],
                correct: [523, 659, 784],
                wrong: [220, 185],
                boost: [330, 440, 660, 880],
                finish: [523, 659, 784, 1047],
                victory: [523, 659, 784, 1047, 784, 1047]
            };

            const ketmaKetlik = effektlar[nom];

            if (!ketmaKetlik) {
                console.warn("Bunday ovoz effekti topilmadi:", nom);
                return;
            }

            ketmaKetlik.forEach((chastota, index) => {
                setTimeout(() => {
                    notaChalish(chastota, 0.28, "triangle");
                }, index * 150);
            });
        });
    }

    function g'alabaMusiqasiniBoshlash() {
        return audioOchish().then(() => {
            g'alaba = true;
            musiqaYoqilgan = false;

            if (musiqaIntervali) {
                clearInterval(musiqaIntervali);
                musiqaIntervali = null;
            }

            ovozEffekti("victory");
        });
    }

    function musiqaniToxtatish() {
        musiqaYoqilgan = false;

        if (musiqaIntervali) {
            clearInterval(musiqaIntervali);
            musiqaIntervali = null;
        }
    }

    function ovozBalandliginiBelgilash(qiymat) {
        asosiyOvoz = Math.max(0, Math.min(1, Number(qiymat)));
    }

    function holat() {
        return {
            musiqaYoqilgan,
            g'alaba,
            ovozBalandligi: asosiyOvoz
        };
    }

    return {
        poygaMusiqasiniBoshlash,
        ovozEffekti,
        g'alabaMusiqasiniBoshlash,
        musiqaniToxtatish,
        ovozBalandliginiBelgilash,
        holat
    };
})();

window.MusiqaTizimi = MusiqaTizimi;
