# Release Notes - Versão 34 (Consolidada)

**Build:** 34
**Data:** 21 de Janeiro de 2026

## 🚀 Novidades e Melhorias

### 🛠️ Correções Críticas
*   **Mapa Real-time:** Reescrevemos o módulo de mapas (`mapa.html`) para eliminar o travamento "Conectando...". Agora utilizamos a sintaxe estável do Firebase v8 Compat.
*   **Loop Infinito na Home:** Adicionamos um sistema de proteção (timeout de 5s) na tela inicial. Se a conexão estiver lenta, o app libera a tela automaticamente com opções de recarga manual, impedindo o travamento no spinner.
*   **Travamento no Perfil:** Implementamos uma correção similar no perfil do usuário, garantindo que o nome e foto carreguem (ou usem valores padrão) sem bloquear a interface.
*   **Logout Confiável:** A função de sair (`logout`) foi blindada. O usuário será desconectado e enviado para a tela de login mesmo se houver instabilidade no servidor do Google.

### ✨ Novas Funcionalidades
*   **Upload de Foto de Perfil:** Agora é possível clicar no ícone de câmera no perfil para enviar uma foto real da galeria. A imagem é salva no servidor e atualizada instantaneamente.
*   **Manter Conectado:** Nova opção na tela de login para lembrar a sessão do usuário por 30 dias.
*   **Esqueci Minha Senha:** Fluxo completo de recuperação de senha via e-mail implementado na tela de login.

### 🎨 Melhorias de Interface
*   **Limpeza de Dados Estáticos:** Removemos dados de placeholders (ex: "Carlos") para evitar confusão durante o carregamento. O app agora exibe estados neutros ("Associado", "Carregando...") até que os dados reais cheguem.
*   **Feedback Visual:** Melhoramos a exibição de status dos veículos (Protegido/Bloqueado).

---
*Este build está pronto para distribuição (TestFlight / App Store).*
