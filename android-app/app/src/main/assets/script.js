// Lógica de Precificação para Bambu Lab A1 Mini
const form = document.getElementById('calcForm');

// Inputs
const inputPeso = document.getElementById('pesoFilamento');
const inputHoras = document.getElementById('tempoHoras');
const inputMinutos = document.getElementById('tempoMinutos');
const inputPrecoCarretel = document.getElementById('precoCarretel');
const inputTarifaEnergia = document.getElementById('tarifaEnergia');
const inputPotenciaWatts = document.getElementById('potenciaWatts');
const inputTempoTrabalho = document.getElementById('tempoTrabalhoMinutos');
const inputValorImpressora = document.getElementById('valorImpressora');
const inputVidaUtil = document.getElementById('vidaUtilHoras');
const inputValorHoraTrabalho = document.getElementById('valorHoraTrabalho');
const inputTaxaFalha = document.getElementById('taxaFalha');
const inputMargemLucro = document.getElementById('margemLucro');

// Elementos de Display de Sliders e Helpers
const taxaFalhaVal = document.getElementById('taxaFalhaVal');
const margemLucroVal = document.getElementById('margemLucroVal');
const tempoTotalHorasLabel = document.getElementById('tempoTotalHorasLabel');
const custoHoraMaquinaLabel = document.getElementById('custoHoraMaquinaLabel');

// Outputs de Resultados
const resPrecoFinal = document.getElementById('resPrecoFinal');
const resLucroReais = document.getElementById('resLucroReais');
const resCustoBase = document.getElementById('resCustoBase');
const resValorFalha = document.getElementById('resValorFalha');
const resCustoTotal = document.getElementById('resCustoTotal');
const resLucroNominal = document.getElementById('resLucroNominal');
const resFalhaPercentSub = document.getElementById('resFalhaPercentSub');
const resMargemPercentSub = document.getElementById('resMargemPercentSub');

// Breakdown
const resCustoMaterial = document.getElementById('resCustoMaterial');
const resCustoEnergia = document.getElementById('resCustoEnergia');
const resCustoDepreciacao = document.getElementById('resCustoDepreciacao');
const resCustoTrabalho = document.getElementById('resCustoTrabalho');

// Labels dinâmicos no breakdown
const resPesoGrams = document.getElementById('resPesoGrams');
const resPrecoKg = document.getElementById('resPrecoKg');
const resPotenciaW = document.getElementById('resPotenciaW');
const resTempoH = document.getElementById('resTempoH');
const resTaxaDeprec = document.getElementById('resTaxaDeprec');
const resTempoMaoObraMin = document.getElementById('resTempoMaoObraMin');

// Barras de proporção
const barMaterial = document.getElementById('barMaterial');
const barEnergia = document.getElementById('barEnergia');
const barMaquina = document.getElementById('barMaquina');
const barTrabalho = document.getElementById('barTrabalho');

// Textos e snippets
const quoteText = document.getElementById('quoteText');
const javaCodeBlock = document.getElementById('javaCodeBlock');
const btnReset = document.getElementById('btnReset');
const btnCopyQuote = document.getElementById('btnCopyQuote');
const btnShareQuote = document.getElementById('btnShareQuote');
const btnInstallApp = document.getElementById('btnInstallApp');
const btnCopyJava = document.getElementById('btnCopyJava');
const toast = document.getElementById('toast');

// Formatação Monetária BRL
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcular() {
  const peso = parseFloat(inputPeso.value) || 0;
  const horas = parseFloat(inputHoras.value) || 0;
  const minutos = parseFloat(inputMinutos.value) || 0;
  const tempoTotalHoras = horas + (minutos / 60);

  const precoRolo = parseFloat(inputPrecoCarretel.value) || 0;
  const tarifaKwh = parseFloat(inputTarifaEnergia.value) || 0;
  const potenciaW = parseFloat(inputPotenciaWatts.value) || 0;
  const tempoTrabalhoMin = parseFloat(inputTempoTrabalho.value) || 0;
  const tempoTrabalhoH = tempoTrabalhoMin / 60;

  const valorMaquina = parseFloat(inputValorImpressora.value) || 0;
  const vidaUtilH = parseFloat(inputVidaUtil.value) || 1;
  const valorHoraTrabalhador = parseFloat(inputValorHoraTrabalho.value) || 0;

  const pctFalha = parseFloat(inputTaxaFalha.value) || 0;
  const pctLucro = parseFloat(inputMargemLucro.value) || 0;

  // 1. Desmembramento de Custos
  // Material: (Preço / 1000) * peso
  const custoMaterial = (precoRolo / 1000) * peso;

  // Energia: (potencia em kW) * tempoTotalHoras * tarifa
  const consumoKw = potenciaW / 1000;
  const custoEnergia = consumoKw * tempoTotalHoras * tarifaKwh;

  // Depreciação: (valorMaquina / vidaUtil) * tempoTotalHoras
  const taxaDeprecPorHora = vidaUtilH > 0 ? (valorMaquina / vidaUtilH) : 0;
  const custoDepreciacao = taxaDeprecPorHora * tempoTotalHoras;

  // Mão de Obra
  const custoTrabalho = tempoTrabalhoH * valorHoraTrabalhador;

  // Subtotal Custo Base
  const custoBase = custoMaterial + custoEnergia + custoDepreciacao + custoTrabalho;

  // 2. Margens Comerciais
  const valorFalha = custoBase * (pctFalha / 100);
  const custoOperacionalTotal = custoBase + valorFalha;
  const lucroNominal = custoOperacionalTotal * (pctLucro / 100);
  const precoVendaFinal = custoOperacionalTotal + lucroNominal;

  // Atualização dos Textos e Sliders
  taxaFalhaVal.textContent = `${pctFalha}%`;
  margemLucroVal.textContent = `${pctLucro}%`;
  tempoTotalHorasLabel.textContent = `Equivale a ${tempoTotalHoras.toFixed(2)} horas`;
  custoHoraMaquinaLabel.textContent = `Depreciação: ${formatBRL(taxaDeprecPorHora)}/hora`;

  // Atualização dos Outputs
  resPrecoFinal.textContent = formatBRL(precoVendaFinal);
  resLucroReais.textContent = formatBRL(lucroNominal);
  resCustoBase.textContent = formatBRL(custoBase);
  resValorFalha.textContent = formatBRL(valorFalha);
  resCustoTotal.textContent = formatBRL(custoOperacionalTotal);
  resLucroNominal.textContent = formatBRL(lucroNominal);

  resFalhaPercentSub.textContent = `${pctFalha}% sobre custo base`;
  resMargemPercentSub.textContent = `Margem de ${pctLucro}%`;

  // Detalhamento
  resCustoMaterial.textContent = formatBRL(custoMaterial);
  resCustoEnergia.textContent = formatBRL(custoEnergia);
  resCustoDepreciacao.textContent = formatBRL(custoDepreciacao);
  resCustoTrabalho.textContent = formatBRL(custoTrabalho);

  // Labels dinâmicos
  resPesoGrams.textContent = peso.toFixed(2);
  resPrecoKg.textContent = precoRolo.toFixed(2);
  resPotenciaW.textContent = potenciaW;
  resTempoH.textContent = tempoTotalHoras.toFixed(2);
  resTaxaDeprec.textContent = formatBRL(taxaDeprecPorHora);
  resTempoMaoObraMin.textContent = tempoTrabalhoMin;

  // Proporções visuais na barra
  if (custoBase > 0) {
    barMaterial.style.width = `${(custoMaterial / custoBase) * 100}%`;
    barEnergia.style.width = `${(custoEnergia / custoBase) * 100}%`;
    barMaquina.style.width = `${(custoDepreciacao / custoBase) * 100}%`;
    barTrabalho.style.width = `${(custoTrabalho / custoBase) * 100}%`;
  }

  // Geração do Orçamento Copiável
  quoteText.textContent = 
`📦 PROPOSTA DE IMPRESSÃO 3D (Bambu Lab A1 Mini)
---------------------------------------------
• Tempo de Impressão: ${horas}h ${minutos}m (${tempoTotalHoras.toFixed(2)}h)
• Peso Estimado: ${peso.toFixed(2)}g (Material Premium)
• Garantia & Inspeção Técnica inclusas

💰 Investimento Total: ${formatBRL(precoVendaFinal)}
Prazo de produção estimado: Pronta entrega / 1 a 2 dias úteis.`;

  // Atualizar Código Java com os parâmetros
  atualizarJavaCode(precoRolo, tarifaKwh, potenciaW, valorMaquina, vidaUtilH, valorHoraTrabalhador, pctFalha, pctLucro);
}

function atualizarJavaCode(precoRolo, tarifaKwh, potenciaW, valorMaquina, vidaUtilH, valorHora, pctFalha, pctLucro) {
  const javaTemplate = `public class CalculadoraImpressao3D {

    // Configurações e Custos Fixos (Bambu Lab A1 Mini)
    private static final double PRECO_ROLO_KG = ${precoRolo.toFixed(2)};
    private static final double POTENCIA_KW = ${(potenciaW / 1000).toFixed(4)}; // ${potenciaW}W
    private static final double TARIFA_KWH = ${tarifaKwh.toFixed(2)};
    private static final double DEPRECIACAO_HORA = ${(valorMaquina / vidaUtilH).toFixed(4)}; // R$ ${valorMaquina} / ${vidaUtilH}h
    private static final double VALOR_HORA_TRABALHO = ${valorHora.toFixed(2)};
    private static final double TAXA_FALHA = ${(pctFalha / 100).toFixed(2)}; // ${pctFalha}%
    private static final double MARGEM_LUCRO = ${(pctLucro / 100).toFixed(2)}; // ${pctLucro}%

    public static class ResultadoPrecificacao {
        public double custoMaterial;
        public double custoEnergia;
        public double custoDepreciacao;
        public double custoMaoDeObra;
        public double custoBase;
        public double custoOperacionalTotal;
        public double lucroLiquido;
        public double precoVendaSugerido;
    }

    /**
     * Calcula o preço exato a partir das métricas lidas no Bambu Studio
     * @param pesoGramas peso_g lido no fatiador
     * @param tempoHoras tempo total em horas fracionadas (ex: 3h 12m = 3.20)
     * @param tempoManualMinutos tempo gasto em fatiamento e mesa (ex: 15 min)
     */
    public static ResultadoPrecificacao calcular(double pesoGramas, double tempoHoras, double tempoManualMinutos) {
        ResultadoPrecificacao r = new ResultadoPrecificacao();

        r.custoMaterial = (PRECO_ROLO_KG / 1000.0) * pesoGramas;
        r.custoEnergia = POTENCIA_KW * tempoHoras * TARIFA_KWH;
        r.custoDepreciacao = DEPRECIACAO_HORA * tempoHoras;
        r.custoMaoDeObra = (tempoManualMinutos / 60.0) * VALOR_HORA_TRABALHO;

        r.custoBase = r.custoMaterial + r.custoEnergia + r.custoDepreciacao + r.custoMaoDeObra;
        r.custoOperacionalTotal = r.custoBase * (1.0 + TAXA_FALHA);
        r.lucroLiquido = r.custoOperacionalTotal * MARGEM_LUCRO;
        r.precoVendaSugerido = r.custoOperacionalTotal + r.lucroLiquido;

        return r;
    }

    public static void main(String[] args) {
        // Exemplo: 73.45g e 3.2 horas (3h 12m), 15 min de intervenção
        ResultadoPrecificacao res = calcular(73.45, 3.2, 15.0);
        System.out.printf("Custo Base: R$ %.2f%n", res.custoBase);
        System.out.printf("Preço de Venda Sugerido: R$ %.2f%n", res.precoVendaSugerido);
    }
}`;
  javaCodeBlock.textContent = javaTemplate;
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Persistência em LocalStorage (para salvar parâmetros do usuário no celular)
const STORAGE_KEY = 'bambu_calc_params_v1';

function salvarParametros() {
  const dados = {
    peso: inputPeso.value,
    horas: inputHoras.value,
    minutos: inputMinutos.value,
    precoCarretel: inputPrecoCarretel.value,
    tarifaEnergia: inputTarifaEnergia.value,
    potenciaWatts: inputPotenciaWatts.value,
    tempoTrabalho: inputTempoTrabalho.value,
    valorImpressora: inputValorImpressora.value,
    vidaUtil: inputVidaUtil.value,
    valorHoraTrabalho: inputValorHoraTrabalho.value,
    taxaFalha: inputTaxaFalha.value,
    margemLucro: inputMargemLucro.value
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (e) {
    // Modo privado ou storage desabilitado
  }
}

function carregarParametros() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      const d = JSON.parse(salvo);
      if (d.peso !== undefined) inputPeso.value = d.peso;
      if (d.horas !== undefined) inputHoras.value = d.horas;
      if (d.minutos !== undefined) inputMinutos.value = d.minutos;
      if (d.precoCarretel !== undefined) inputPrecoCarretel.value = d.precoCarretel;
      if (d.tarifaEnergia !== undefined) inputTarifaEnergia.value = d.tarifaEnergia;
      if (d.potenciaWatts !== undefined) inputPotenciaWatts.value = d.potenciaWatts;
      if (d.tempoTrabalho !== undefined) inputTempoTrabalho.value = d.tempoTrabalho;
      if (d.valorImpressora !== undefined) inputValorImpressora.value = d.valorImpressora;
      if (d.vidaUtil !== undefined) inputVidaUtil.value = d.vidaUtil;
      if (d.valorHoraTrabalho !== undefined) inputValorHoraTrabalho.value = d.valorHoraTrabalho;
      if (d.taxaFalha !== undefined) inputTaxaFalha.value = d.taxaFalha;
      if (d.margemLucro !== undefined) inputMargemLucro.value = d.margemLucro;
    }
  } catch (e) {
    // Ignora erro de parsing
  }
}

// Event Listeners para recálculo automático e salvamento
[
  inputPeso, inputHoras, inputMinutos, inputPrecoCarretel,
  inputTarifaEnergia, inputPotenciaWatts, inputTempoTrabalho,
  inputValorImpressora, inputVidaUtil, inputValorHoraTrabalho,
  inputTaxaFalha, inputMargemLucro
].forEach(input => {
  input.addEventListener('input', () => {
    calcular();
    salvarParametros();
  });
});

// Botão Reset
btnReset.addEventListener('click', () => {
  inputPeso.value = 73.45;
  inputHoras.value = 3;
  inputMinutos.value = 12;
  inputPrecoCarretel.value = 120.00;
  inputTarifaEnergia.value = 1.00;
  inputPotenciaWatts.value = 75;
  inputTempoTrabalho.value = 15;
  inputValorImpressora.value = 3500.00;
  inputVidaUtil.value = 5000;
  inputValorHoraTrabalho.value = 30.00;
  inputTaxaFalha.value = 15;
  inputMargemLucro.value = 100;
  calcular();
  salvarParametros();
  showToast("Valores redefinidos para o exemplo padrão!");
});

// Botão Compartilhar Orçamento (WhatsApp / Android Native Share)
if (btnShareQuote) {
  btnShareQuote.addEventListener('click', async () => {
    const texto = quoteText.textContent.trim();

    // 1. Prioridade: Bridge do APK Nativo Android
    if (window.AndroidNative && typeof window.AndroidNative.shareQuote === 'function') {
      window.AndroidNative.shareQuote(texto);
      showToast("Abrindo compartilhamento do Android...");
      return;
    }

    // 2. Segunda opção: Web Share API (Navegador Android Chrome / PWA)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Orçamento Impressão 3D | Bambu A1 Mini',
          text: texto
        });
        showToast("Orçamento compartilhado!");
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Erro ao compartilhar:', err);
        }
      }
    }
    
    // 3. Fallback: abre direto o WhatsApp Web / App com o texto codificado
    const urlWa = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(urlWa, '_blank');
  });
}

// Botões Copiar
btnCopyQuote.addEventListener('click', () => {
  navigator.clipboard.writeText(quoteText.textContent).then(() => {
    showToast("Orçamento copiado com sucesso!");
  });
});

btnCopyJava.addEventListener('click', () => {
  navigator.clipboard.writeText(javaCodeBlock.textContent).then(() => {
    showToast("Código Java copiado com sucesso!");
  });
});

// Suporte a Instalação no Android (PWA beforeinstallprompt)
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstallApp) {
    btnInstallApp.style.display = 'inline-flex';
  }
});

if (btnInstallApp) {
  btnInstallApp.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast("Aplicativo instalado no seu Android!");
      }
      deferredPrompt = null;
      btnInstallApp.style.display = 'none';
    } else {
      showToast("Toque no menu (⋮) do navegador e selecione 'Instalar aplicativo' ou 'Adicionar à tela de início'");
    }
  });
}

window.addEventListener('appinstalled', () => {
  if (btnInstallApp) btnInstallApp.style.display = 'none';
  showToast("Aplicativo Bambu 3D pronto para uso!");
});

// Registro do Service Worker (Offline First)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('ServiceWorker registrado:', reg.scope))
      .catch((err) => console.log('Falha ao registrar ServiceWorker:', err));
  });
}

// Inicialização imediata
carregarParametros();
calcular();
