function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

async function fetchComTimeout(url) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); 
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) throw new Error("Erro no servidor");
    return response.json();
}

async function calculateDistance() {
    const originInput = document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!originInput) {
        resultDiv.innerHTML = "Por favor, digite o nome de uma cidade.";
        return;
    }

    const cacheKey = "benaz_" + originInput.toLowerCase();
    const cachedResult = localStorage.getItem(cacheKey);

    if (cachedResult) {
        resultDiv.innerHTML = cachedResult;
        return; 
    }

    resultDiv.innerHTML = "Calculando a melhor rota... ⏳";

    try {
        const searchQuery = encodeURIComponent(originInput);
        const geoData = await fetchComTimeout(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&email=contato@benaz.com.br&q=${searchQuery}`);

        if (geoData.length === 0) {
            resultDiv.innerHTML = "Cidade não encontrada, tente colocar a sigla do estado (ex: Ibirá, SP).";
            return;
        }

        const originLat = geoData[0].lat;
        const originLon = geoData[0].lon;

        const rioPreto = { lat: -20.8113, lon: -49.3758 };
        const catanduva = { lat: -21.1372, lon: -48.9733 };

        const [dataRioPreto, dataCatanduva] = await Promise.all([
            fetchComTimeout(`https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${rioPreto.lon},${rioPreto.lat}?overview=false`),
            fetchComTimeout(`https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${catanduva.lon},${catanduva.lat}?overview=false`)
        ]);

        if (dataRioPreto.code !== "Ok" || dataCatanduva.code !== "Ok") {
             resultDiv.innerHTML = "❌ Não foi possível traçar uma rota para esta localização.";
             return;
        }

        const distRioPretoMeters = dataRioPreto.routes[0].distance;
        const kmRioPreto = (distRioPretoMeters / 1000).toFixed(1).replace('.', ',');

        const distCatanduvaMeters = dataCatanduva.routes[0].distance;
        const kmCatanduva = (distCatanduvaMeters / 1000).toFixed(1).replace('.', ',');

        const limiteMetros = 350000; 
        const menorDistancia = Math.min(distRioPretoMeters, distCatanduvaMeters);

        let htmlFinal = "";

        if (menorDistancia > limiteMetros) {
            htmlFinal = `❌ <span style="color: var(--text-main); font-size: 20px;">Lead muito distante!</span><br>
                         <span class="detalhes" style="margin-bottom: 5px;">
                         A unidade mais "próxima" está a ${(menorDistancia / 1000).toFixed(1).replace('.', ',')} km de distância.</span><br>
                         <a href="https://suzukimotos.com.br/concessionarias/" target="_blank" class="btn-suzuki">
                            Acessar Rede <img src="https://suzukimotos.com.br/images/footer/logo_suzuki.svg" alt="Suzuki">
                         </a>`;
        } else if (distRioPretoMeters < distCatanduvaMeters) {
            htmlFinal = `✅ Direcionar para:<br><span class="destaque">São José do Rio Preto</span>
                         <span class="detalhes">
                         🛣️ Distância até Rio Preto: ${kmRioPreto} km<br>
                         🛣️ Distância até Catanduva: ${kmCatanduva} km</span>`;
        } else {
            htmlFinal = `✅ Direcionar para:<br><span class="destaque">Catanduva</span>
                         <span class="detalhes">
                         🛣️ Distância até Catanduva: ${kmCatanduva} km<br>
                         🛣️ Distância até Rio Preto: ${kmRioPreto} km</span>`;
        }

        resultDiv.innerHTML = htmlFinal;
        localStorage.setItem(cacheKey, htmlFinal);

    } catch (error) {
        resultDiv.innerHTML = "⚠️ O servidor de mapas está sobrecarregado. Aguarde alguns segundos e tente novamente.";
        console.error(error);
    }
}