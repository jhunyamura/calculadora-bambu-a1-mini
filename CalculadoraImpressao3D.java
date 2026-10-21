/**
 * Calculadora de Precificação para Impressão 3D (Bambu Lab A1 Mini)
 * Modelo matemático com custos diretos, indiretos, taxa de falha e margem comercial.
 */
public class CalculadoraImpressao3D {

    // Configurações Padrão / Parâmetros do Negócio
    private double precoRoloKg = 120.00;             // R$ / 1000g
    private double potenciaKw = 0.075;               // 75W = 0.075 kW (Média A1 Mini em PLA)
    private double tarifaKwh = 1.00;                 // R$ / kWh
    private double valorImpressora = 3500.00;        // Custo de aquisição da máquina
    private double vidaUtilHoras = 5000.0;           // Vida útil estimada em horas
    private double valorHoraTrabalho = 30.00;        // Valor da hora técnica humana
    private double taxaFalhaPercentual = 0.15;       // 15% para suportes, calibrações, falhas
    private double margemLucroPercentual = 1.00;     // 100% de margem sobre o custo operacional

    public CalculadoraImpressao3D() {}

    public CalculadoraImpressao3D(double precoRoloKg, double tarifaKwh, double valorHoraTrabalho, 
                                  double taxaFalhaPercentual, double margemLucroPercentual) {
        this.precoRoloKg = precoRoloKg;
        this.tarifaKwh = tarifaKwh;
        this.valorHoraTrabalho = valorHoraTrabalho;
        this.taxaFalhaPercentual = taxaFalhaPercentual;
        this.margemLucroPercentual = margemLucroPercentual;
    }

    public static class ResultadoPrecificacao {
        public double custoMaterial;
        public double custoEnergia;
        public double custoDepreciacao;
        public double custoMaoDeObra;
        public double custoBase;
        public double valorFalha;
        public double custoOperacionalTotal;
        public double lucroLiquido;
        public double precoVendaSugerido;

        @Override
        public String toString() {
            return String.format(
                "--- RESUMO DE PRECIFICAÇÃO ---\n" +
                "Material (Filamento):  R$ %.2f\n" +
                "Energia Elétrica:      R$ %.2f\n" +
                "Depreciação Máquina:   R$ %.2f\n" +
                "Mão de Obra:           R$ %.2f\n" +
                "------------------------------\n" +
                "Custo Base:            R$ %.2f\n" +
                "Taxa de Risco/Falha:   R$ %.2f\n" +
                "Custo Total Operação:  R$ %.2f\n" +
                "Lucro Líquido Real:    R$ %.2f\n" +
                "==============================\n" +
                "PREÇO FINAL SUGERIDO:  R$ %.2f\n",
                custoMaterial, custoEnergia, custoDepreciacao, custoMaoDeObra,
                custoBase, valorFalha, custoOperacionalTotal, lucroLiquido, precoVendaSugerido
            );
        }
    }

    /**
     * Calcula o valor da impressão
     * @param pesoGramas Peso lido no fatiador Bambu Studio (ex: 73.45)
     * @param tempoHoras Tempo total em horas decimais (ex: 3h 12m = 3.2)
     * @param tempoManualMinutos Minutos de dedicação humana (fatiar, preparar mesa, destacar peça)
     * @return Resultado detalhado com todos os custos e preço final
     */
    public ResultadoPrecificacao calcular(double pesoGramas, double tempoHoras, double tempoManualMinutos) {
        ResultadoPrecificacao res = new ResultadoPrecificacao();

        // 1. Custos Diretos e Indiretos
        res.custoMaterial = (this.precoRoloKg / 1000.0) * pesoGramas;
        res.custoEnergia = this.potenciaKw * tempoHoras * this.tarifaKwh;
        
        double taxaDepreciacaoHora = (this.vidaUtilHoras > 0) ? (this.valorImpressora / this.vidaUtilHoras) : 0.0;
        res.custoDepreciacao = taxaDepreciacaoHora * tempoHoras;
        
        res.custoMaoDeObra = (tempoManualMinutos / 60.0) * this.valorHoraTrabalho;

        // Custo Base
        res.custoBase = res.custoMaterial + res.custoEnergia + res.custoDepreciacao + res.custoMaoDeObra;

        // 2. Margens Comerciais e Falhas
        res.valorFalha = res.custoBase * this.taxaFalhaPercentual;
        res.custoOperacionalTotal = res.custoBase + res.valorFalha;
        res.lucroLiquido = res.custoOperacionalTotal * this.margemLucroPercentual;
        res.precoVendaSugerido = res.custoOperacionalTotal + res.lucroLiquido;

        return res;
    }

    public static void main(String[] args) {
        CalculadoraImpressao3D calc = new CalculadoraImpressao3D();
        
        // Exemplo: 73.45g de PLA, 3h 12m (3.2 horas), 15 minutos de intervenção humana
        ResultadoPrecificacao resultado = calc.calcular(73.45, 3.2, 15.0);
        
        System.out.println(resultado);
    }
}
