# 🏍️ Guia Benaz Motos

Este projeto nasceu de uma necessidade real no meu dia a dia de trabalho na **Benaz Motos**. 
Eu percebi que gastava muito tempo fazendo pesquisas manuais no Google Maps para decidir para qual unidade (São José do Rio Preto ou Catanduva) eu deveria direcionar cada novo lead.

Em vez de continuar no "Ctrl+C e Ctrl+V" infinito, resolvi aplicar o que aprendi no primeiro semestre da faculdade e construir uma ferramenta que fizesse esse trabalho por mim.

---

Toda vez que um lead chegava, eu precisava:
1. Abrir o Maps.
2. Digitar a cidade do lead.
3. Verificar a distância até Rio Preto.
4. Verificar a distância até Catanduva.
5. Comparar e decidir.

Agora basta digitar o nome da cidade e o sistema me entrega a resposta em milissegundos.

### O que eu implementei:
* **Performance:** Usei `Promise.all` para buscar as duas rotas ao mesmo tempo.
* **Memória (Cache):** Implementei `localStorage`, se eu já pesquisei "Bebedouro" hoje, amanhã o resultado aparece instantaneamente sem precisar gastar internet ou processamento.
* **Regra de Negócio (Bloqueio de 350km):** Se o lead for muito distante, o sistema me avisa visualmente e já oferece um atalho para a rede oficial da **Suzuki**, garantindo que o cliente não fique sem suporte.
* **UX/UI:** Dark Mode integrado para não cansar a vista durante o expediente e uma interface totalmente responsiva.

### Tecnologias Utilizadas
* **HTML5 & CSS3**, com variáveis para temas.
* **JavaScript** com `async/await`.
* **API Nominatim (OpenStreetMap)** para geocodificação.
* **API OSRM** para cálculos de rotas de direção real, não apenas linha reta.

---

### Sobre mim
Sou estudante de tecnologia e acredito que o código deve servir para facilitar a vida das pessoas e otimizar negócios, este projeto é um exemplo de como pequenas automações podem gerar grandes ganhos de eficiência.

---
*Projeto desenvolvido para uso interno na Benaz Motos.*
