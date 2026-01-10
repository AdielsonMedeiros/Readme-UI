import { Translations } from './en';

export const pt: Translations = {
  colors: {
    blue: "Azul",
    purple: "Roxo",
    green: "Verde",
    orange: "Laranja",
    pink: "Rosa",
    red: "Vermelho",
    cyan: "Ciano",
    yellow: "Amarelo"
  },
  common: {
    loading: "Gerando...",
    generate: "Gerar Widgets",
    generatePreview: "Gerar Prévia",
    copy: "Copiar Markdown",
    copied: "Copiado!",
    ready: "Pronto para Criar?",
    readyDesc: "Selecione um modelo na barra lateral, personalize suas configurações e clique em Gerar Prévia para ver a mágica acontecer!",
    changeTemplate: "Alterar",
    selectedTemplate: "Modelo Selecionado",
    chooseTemplate: "Escolher Modelo",
    howToUse: "Como usar",
    default: "Padrão"
  },
  sidebar: {
    accent: "Cor de Destaque",
    configuration: "Configuração",
    theme: "Tema",
    darkMode: "Modo Escuro",
    lightMode: "Modo Claro",
    width: "Largura",
    height: "Altura",
    style: "Estilo"
  },
  templates: {
    spotify: {
      status: "Texto de Status",
      songTitle: "Nome da Música",
      artist: "Artista",
      progress: "Progresso",
      duration: "Duração (segundos)",
      durationDesc: "Duração total (ex: 210 = 3:30)"
    },
    goodreads: {
      userId: "ID do Goodreads (Automágico ✨)",
      userIdDesc: "Encontrado na URL do perfil. Se definido, atualiza automaticamente!",
      manualConfig: "Ou configure manualmente:",
      bookTitle: "Título do Livro",
      author: "Autor",
      progress: "Progresso"
    },
    techStack: {
      title: "Título da Stack (Opcional)",
      skills: "Habilidades (Separadas por vírgula)",
      skillsDesc: "Use slugs do simpleicons.org (ex: nextdotjs, nodedotjs)"
    },
    weather: {
      location: "Localização",
      locationDesc: "Nome da cidade (ex: São Paulo) ou CEP"
    },
    wakatime: {
      url: "URL JSON Pública (Opcional)",
      urlDesc: "Habilite \"Share coding activity\" no WakaTime para obter isto."
    },
    devJoke: {
        label: "Piada Dev"
    },
    social: {
        github: "Usuário GitHub",
        linkedin: "LinkedIn",
        twitter: "Twitter/X",
        email: "E-mail",
        website: "Website"
    },
    quote: {
        text: "Citação",
        placeholder: "Deixe vazio para citação aleatória",
        author: "Autor"
    },
    project: {
        repo: "Repositório GitHub (Auto-busca)",
        repoDesc: "Insira usuário/repo para buscar dados automaticamente",
        manual: "Ou personalize manualmente:",
        name: "Nome do Projeto",
        description: "Descrição",
        stars: "Estrelas",
        forks: "Forks",
        token: "Token GitHub (Opcional)",
        tokenDesc: "Forneça um token para aumentar os limites da API (5000 req/hr)."
    },
    typing: {
        lines: "Linhas de Texto (Separe com |)",
        linesDesc: "Use | para separar múltiplas linhas"
    },
    joke: {
        desc: "🎲 Deixe vazio para uma piada aleatória!",
        custom: "Piada Personalizada",
        punchline: "Resposta da Piada"
    },
    visitors: {
        username: "Usuário GitHub (Auto-busca)",
        usernameDesc: "Mostra seguidores + repos como métrica",
        manual: "Ou defina manualmente:",
        count: "Contagem",
        label: "Rótulo"
    },
    hacking: {
        username: "Usuário Alvo",
        desc: "Irá buscar repositórios recentes para \"hackear\""
    },
    music: {
        track: "Nome da Faixa",
        artist: "Artista",
        color: "Cor da Barra"
    },
    activity: {
        username: "Usuário",
        desc: "Gera um skyline 3D de contribuições"
    },
    snake: {
        username: "Usuário GitHub",
        desc: "A cobra vai comer seus commits recentes reais!"
    },
    leetcode: {
        username: "Usuário LeetCode",
        desc: "Busca estatísticas ao vivo da API do LeetCode"
    },
    wave: {
        text: "Texto Principal",
        subtitle: "Subtítulo"
    }
  },
  help: {
    title: "Como usar",
    configure: "Como Configurar",
    quickStart: {
        title: "Início Rápido",
        text: "Selecione um modelo à esquerda, personalize os campos e clique em Copiar Markdown. Cole o código no README do seu Perfil GitHub."
    },
    goodreads: {
        title: "Atualizações Automáticas do Goodreads",
        text: "Para que seu livro atualize automaticamente:",
        step1: "Vá para o seu Perfil no Goodreads.",
        step2: "Olhe a URL: goodreads.com/user/show/123456-name.",
        step3: "Copie o número (123456) e cole no campo ID do Goodreads."
    },
    wakatime: {
        title: "Estatísticas do WakaTime",
        step1: "Faça login no WakaTime e vá em Settings > Profile.",
        step2: "Marque \"Display coding activity publicly\".",
        step3: "Mude \"Readable by\" para Everyone em \"Languages\".",
        step4: "Copie a URL JSON fornecida lá e cole no widget."
    },
    spotify: {
        title: "Spotify",
        text: "Para o widget do Spotify mostrar \"Tocando Agora\" em tempo real, você atualmente precisa definir a música manualmente neste gerador.",
        note: "(Integração OAuth completa em breve!)"
    },
    close: "Fechar"
  }
};
