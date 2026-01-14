
export class SGAClient {
    constructor(baseUrl, user, pass) {
        this.baseUrl = baseUrl;
        this.credentials = { usuario: user, senha: pass };
        this.token = localStorage.getItem('sga_token');
    }

    async authenticate() {
        if (this.token) return this.token;

        try {
            const res = await fetch(`${this.baseUrl}/usuario/autenticar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.credentials)
            });

            const data = await res.json();
            if (data.token_usuario) {
                this.token = data.token_usuario;
                localStorage.setItem('sga_token', this.token);
                return this.token;
            } else {
                throw new Error('Token não retornado pela API SGA');
            }
        } catch (e) {
            console.error('Erro na autenticação SGA:', e);
            return null;
        }
    }

    async getBoletos(cpf) {
        const token = await this.authenticate();
        if (!token) return [];

        // Define um intervalo de datas razoável (ex: últimos 30 dias até próximos 60 dias)
        const today = new Date();
        const past = new Date(); past.setDate(today.getDate() - 30);
        const future = new Date(); future.setDate(today.getDate() + 60);

        const formatDate = d => d.toLocaleDateString('pt-BR'); // dd/mm/yyyy

        const payload = {
            cpf_associado: cpf.replace(/\D/g, ''), // Envia apenas números
            data_vencimento_inicial: formatDate(past),
            data_vencimento_final: formatDate(future),
            // codigo_situacao_boleto: 1 // Pode filtrar por 'Aberto' se soubermos o código. Geralmente 1 ou 'ABERTO'.
        };

        try {
            const res = await fetch(`${this.baseUrl}/listar/boleto-associado/periodo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            // A API retorna algo como { boletos: [...] } ou array direto? 
            // Exemplo Retorno Doc: { "nosso_numero": "...", ... } (Parece um objeto único ou array?)
            // O exemplo de retorno da doc para listar/boleto-associado/periodo mostra chaves soltas...
            // Mas listar/boleto-associado-veiculo mostra um array em outro lugar. 
            // Vamos assumir que retorna uma lista ou um objeto encapsulando.
            // O endpoint 'listar/boleto' retorna um array no exemplo. 
            // Vamos retornar 'data' por enquanto e tratar no frontend.
            return data; 
        } catch (e) {
            console.error('Erro ao buscar boletos:', e);
            return [];
        }
    }
}
