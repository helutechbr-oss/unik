
export class SGAClient {
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    async getBoletos(cpf) {
        if (!this.token) {
            console.error('Token SGA não configurado.');
            return [];
        }

        // Define um intervalo: boletos vencidos ha 30 dias ate vencerem daqui a 90 dias
        const today = new Date();
        const past = new Date(); 
        past.setDate(today.getDate() - 30);
        const future = new Date(); 
        future.setDate(today.getDate() + 90);

        const formatDate = d => d.toLocaleDateString('pt-BR'); // dd/mm/yyyy

        const payload = {
            cpf_associado: cpf.replace(/\D/g, ''), // Envia apenas números
            data_vencimento_inicial: formatDate(past),
            data_vencimento_final: formatDate(future),
            link_boleto: true // Solicita o link do boleto
        };

        try {
            const res = await fetch(`${this.baseUrl}/listar/boleto-associado/periodo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                console.error(`Erro na API SGA: ${res.status} ${res.statusText}`);
                return [];
            }

            const data = await res.json();
            
            // A API pode retornar { boletos: [...] } ou array direto ou outras chaves
            // A documentação sugere retorno de chaves soltas no exemplo, ou array no example response 
            // "Exemplo Retorno: { nosso_numero: ... }" (um objeto só?)
            // Se retornar array de objetos, ok.
            
            if (Array.isArray(data)) {
                 return data;
            } else if (data && data.boletos && Array.isArray(data.boletos)) {
                 return data.boletos;
            } else if (data && data.nosso_numero) {
                 // Retornou um unico objeto
                 return [data];
            } else {
                 return [];
            }

        } catch (e) {
            console.error('Erro ao buscar boletos:', e);
            return [];
        }
    }
}
