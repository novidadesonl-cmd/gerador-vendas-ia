import { FormEvent, useMemo, useState } from 'react';

type Page = 'home' | 'gerador' | 'biblioteca' | 'guia' | 'planos' | 'ativar' | 'obrigado';

type PromptCategory =
  | 'reels'
  | 'post'
  | 'legenda'
  | 'anuncio'
  | 'whatsapp'
  | 'objecoes'
  | 'pagina'
  | 'calendario'
  | 'humanizar'
  | 'oferta';

type PromptForm = {
  nicho: string;
  produto: string;
  publico: string;
  dor: string;
  desejo: string;
  tom: string;
  canal: string;
  objetivo: string;
  observacoes: string;
};

type PromptTemplate = {
  id: PromptCategory;
  label: string;
  description: string;
  role: string;
  output: string;
  example: PromptForm;
};

type LibraryItem = {
  title: string;
  category: string;
  when: string;
  target?: PromptCategory;
};

const initialForm: PromptForm = {
  nicho: '',
  produto: '',
  publico: '',
  dor: '',
  desejo: '',
  tom: 'Direto, claro e humano',
  canal: 'Instagram',
  objetivo: 'Gerar interesse e levar para o WhatsApp',
  observacoes: '',
};

const checkoutLinks = {
  plan27: 'https://pay.kiwify.com.br/SEU-LINK-27',
  plan47: 'https://pay.kiwify.com.br/SEU-LINK-47',
  plan97: 'https://pay.kiwify.com.br/SEU-LINK-97',
};

const accessCodes: Record<string, string> = {
  COMANDO27: 'Kit Inicial R$27',
  COMANDO47: 'Gerador Interativo R$47',
  COMANDO97: 'Comando Pronto IA Pro R$97',
};

const templates: PromptTemplate[] = [
  {
    id: 'reels',
    label: 'Roteiro de Reels/Shorts/TikTok',
    description: 'Crie um roteiro curto com gancho, cena, desenvolvimento e CTA.',
    role: 'Você é um estrategista de vídeos curtos e copywriter de retenção para Reels, Shorts e TikTok.',
    output: 'Entregue 3 roteiros em formato: gancho, cena, desenvolvimento, frase de impacto e CTA. Cada roteiro deve ter até 45 segundos.',
    example: {
      nicho: 'Estética facial',
      produto: 'Limpeza de pele',
      publico: 'Mulheres de 25 a 45 anos',
      dor: 'Pele oleosa, cravos e sensação de rosto pesado',
      desejo: 'Ter uma pele limpa, leve e mais cuidada',
      tom: 'Profissional, direto e acolhedor',
      canal: 'Instagram Reels',
      objetivo: 'Gerar agendamentos pelo WhatsApp',
      observacoes: 'Evitar promessas de resultado milagroso.',
    },
  },
  {
    id: 'post',
    label: 'Post de Instagram',
    description: 'Crie um post com ideia central, texto e CTA.',
    role: 'Você é um estrategista de conteúdo para pequenos negócios que precisam vender sem parecer forçados.',
    output: 'Entregue 5 ideias de post com título, texto principal, legenda curta e CTA.',
    example: {
      nicho: 'Consultoria de imagem',
      produto: 'Análise de coloração pessoal',
      publico: 'Mulheres que querem se vestir melhor',
      dor: 'Compram roupas, mas sentem que nada combina',
      desejo: 'Ter mais segurança ao escolher roupas e maquiagem',
      tom: 'Elegante, simples e consultivo',
      canal: 'Instagram',
      objetivo: 'Gerar comentários e directs',
      observacoes: 'Usar exemplos do dia a dia.',
    },
  },
  {
    id: 'legenda',
    label: 'Legenda com CTA',
    description: 'Transforme uma ideia solta em legenda persuasiva.',
    role: 'Você é um copywriter de redes sociais especializado em legendas claras e comerciais.',
    output: 'Entregue 5 legendas: curta, média, emocional, direta e educativa. Cada uma deve terminar com um CTA.',
    example: {
      nicho: 'Loja de roupas femininas',
      produto: 'Vestidos casuais',
      publico: 'Mulheres de 25 a 40 anos',
      dor: 'Não sabem montar look rápido para trabalhar e sair',
      desejo: 'Parecer arrumada sem perder tempo',
      tom: 'Leve, prático e feminino',
      canal: 'Instagram',
      objetivo: 'Levar para o direct',
      observacoes: 'Sem exagerar em emojis.',
    },
  },
  {
    id: 'anuncio',
    label: 'Anúncio curto',
    description: 'Crie copies de anúncio para testar dor e desejo.',
    role: 'Você é um estrategista de anúncios de resposta direta para produtos simples e serviços locais.',
    output: 'Entregue 5 versões de anúncio com gancho, dor, promessa segura, prova lógica e CTA.',
    example: {
      nicho: 'Social media para negócios locais',
      produto: 'Pacote de posts mensais',
      publico: 'Donos de pequenos negócios',
      dor: 'Não conseguem postar com constância',
      desejo: 'Atrair clientes sem perder horas criando conteúdo',
      tom: 'Direto e comercial',
      canal: 'Facebook/Instagram Ads',
      objetivo: 'Gerar orçamento',
      observacoes: 'Não prometer viralização.',
    },
  },
  {
    id: 'whatsapp',
    label: 'Mensagem de WhatsApp',
    description: 'Crie mensagens naturais para atendimento e venda.',
    role: 'Você é especialista em vendas consultivas por WhatsApp, com linguagem humana e sem pressão agressiva.',
    output: 'Entregue mensagem inicial, explicação do produto, resposta para preço, follow-up e fechamento consultivo.',
    example: {
      nicho: 'Design de sobrancelhas',
      produto: 'Design com henna',
      publico: 'Mulheres que querem valorizar o rosto',
      dor: 'Sobrancelha falhada ou sem desenho',
      desejo: 'Ter aparência mais cuidada',
      tom: 'Acolhedor e profissional',
      canal: 'WhatsApp',
      objetivo: 'Agendar horário',
      observacoes: 'Mensagens com no máximo 4 linhas.',
    },
  },
  {
    id: 'objecoes',
    label: 'Quebra de objeções',
    description: 'Prepare respostas para preço, dúvida, tempo e confiança.',
    role: 'Você é um estrategista de objeções de venda para pequenos negócios e produtos digitais de baixo ticket.',
    output: 'Liste as 8 objeções mais prováveis e crie respostas curtas, humanas e sem pressão.',
    example: {
      nicho: 'Curso rápido de Canva',
      produto: 'Mini treinamento para criar posts',
      publico: 'Autônomos que cuidam do próprio Instagram',
      dor: 'Posts feios e pouco profissionais',
      desejo: 'Criar artes melhores sem contratar designer',
      tom: 'Simples e encorajador',
      canal: 'WhatsApp e página de venda',
      objetivo: 'Reduzir dúvidas antes da compra',
      observacoes: 'Evitar prometer design profissional em um dia.',
    },
  },
  {
    id: 'pagina',
    label: 'Página de venda simples',
    description: 'Monte a estrutura de uma página de venda curta.',
    role: 'Você é copywriter de páginas de venda simples para produtos digitais de R$27 a R$97.',
    output: 'Entregue headline, subheadline, bloco de dor, solução, o que recebe, para quem é, garantia, FAQ e CTA.',
    example: {
      nicho: 'IA para pequenos negócios',
      produto: 'Kit de prompts guiados',
      publico: 'Autônomos e criadores iniciantes',
      dor: 'Recebem respostas genéricas da IA',
      desejo: 'Criar posts e mensagens melhores em menos tempo',
      tom: 'Direto, acessível e profissional',
      canal: 'Página de venda',
      objetivo: 'Vender por R$27',
      observacoes: 'Focar em aplicação imediata.',
    },
  },
  {
    id: 'calendario',
    label: 'Calendário de conteúdo',
    description: 'Gere uma sequência de posts organizada por objetivo.',
    role: 'Você é estrategista editorial para pequenos negócios que precisam vender com conteúdo simples.',
    output: 'Crie um calendário de 7 dias com tema, objetivo, gancho, formato e CTA de cada dia.',
    example: {
      nicho: 'Confeitaria artesanal',
      produto: 'Bolos caseiros por encomenda',
      publico: 'Famílias e empresas locais',
      dor: 'Querem encomendar, mas não sabem opções e prazos',
      desejo: 'Comprar algo bonito e confiável para datas especiais',
      tom: 'Próximo, apetitoso e confiável',
      canal: 'Instagram',
      objetivo: 'Receber pedidos no WhatsApp',
      observacoes: 'Intercalar prova, bastidor e oferta.',
    },
  },
  {
    id: 'humanizar',
    label: 'Humanizar texto de IA',
    description: 'Remova clichês, tom robótico e frases vazias.',
    role: 'Você é editor de texto humano, especialista em remover clichês de IA e deixar mensagens mais naturais.',
    output: 'Reescreva o texto em 3 versões: mais direta, mais humana e mais comercial. Explique o que foi removido.',
    example: {
      nicho: 'Marketing digital',
      produto: 'Consultoria de posicionamento',
      publico: 'Prestadores de serviço',
      dor: 'Comunicação genérica que não vende',
      desejo: 'Falar com clareza e autoridade',
      tom: 'Direto, humano e sem clichês',
      canal: 'LinkedIn',
      objetivo: 'Melhorar um texto já gerado por IA',
      observacoes: 'Remover termos como potencialize, jornada e transformador.',
    },
  },
  {
    id: 'oferta',
    label: 'Criar oferta simples',
    description: 'Transforme um serviço ou ideia em uma oferta vendável.',
    role: 'Você é estrategista de ofertas de baixo ticket e serviços simples para pequenos negócios.',
    output: 'Entregue nome da oferta, promessa, público, dor, entrega, bônus, preço sugerido, garantia e CTA.',
    example: {
      nicho: 'Organização digital',
      produto: 'Template de pastas para Google Drive',
      publico: 'Profissionais autônomos desorganizados',
      dor: 'Não acham arquivos e perdem tempo',
      desejo: 'Ter um sistema simples para organizar tudo',
      tom: 'Prático e objetivo',
      canal: 'Página e Reels',
      objetivo: 'Criar uma oferta R$27',
      observacoes: 'Mostrar ganho de tempo, não prometer produtividade infinita.',
    },
  },
];

const libraryItems: LibraryItem[] = [
  { category: 'Conteúdo', title: 'Gerador de ideias de Reels', when: 'Quando você precisa de ideias rápidas para vídeo curto.', target: 'reels' },
  { category: 'Conteúdo', title: 'Gerador de roteiro curto', when: 'Quando já tem uma ideia, mas não sabe estruturar a fala.', target: 'reels' },
  { category: 'Conteúdo', title: 'Gerador de legenda com CTA', when: 'Quando o post está pronto, mas falta texto para converter.', target: 'legenda' },
  { category: 'Conteúdo', title: 'Gerador de carrossel', when: 'Quando quer educar o público em formato passo a passo.', target: 'post' },
  { category: 'Conteúdo', title: 'Gerador de calendário de 7 dias', when: 'Quando precisa de constância sem pensar do zero.', target: 'calendario' },
  { category: 'Venda', title: 'Gerador de oferta simples', when: 'Quando tem uma ideia, mas ainda não tem promessa vendável.', target: 'oferta' },
  { category: 'Venda', title: 'Gerador de post de venda', when: 'Quando precisa vender sem parecer insistente.', target: 'post' },
  { category: 'Venda', title: 'Gerador de anúncio curto', when: 'Quando quer testar criativos de tráfego pago ou orgânico.', target: 'anuncio' },
  { category: 'Venda', title: 'Gerador de quebra de objeções', when: 'Quando clientes dizem caro, vou pensar ou não tenho tempo.', target: 'objecoes' },
  { category: 'Venda', title: 'Gerador de CTA', when: 'Quando o conteúdo está bom, mas não chama para ação.', target: 'legenda' },
  { category: 'WhatsApp', title: 'Resposta para interessado', when: 'Quando alguém chama no WhatsApp pedindo informação.', target: 'whatsapp' },
  { category: 'WhatsApp', title: 'Mensagem para “vou pensar”', when: 'Quando a conversa esfriou depois do preço.', target: 'whatsapp' },
  { category: 'WhatsApp', title: 'Mensagem para objeção de preço', when: 'Quando o cliente compara só valor e não percebe entrega.', target: 'whatsapp' },
  { category: 'WhatsApp', title: 'Mensagem de follow-up', when: 'Quando precisa retomar contato sem incomodar.', target: 'whatsapp' },
  { category: 'WhatsApp', title: 'Mensagem de fechamento consultivo', when: 'Quando o cliente está interessado, mas ainda não decidiu.', target: 'whatsapp' },
  { category: 'Bônus', title: 'Humanizador de texto de IA', when: 'Quando a resposta ficou bonita, mas robótica.', target: 'humanizar' },
  { category: 'Bônus', title: 'Removedor de clichês de IA', when: 'Quando aparecem termos como potencialize, jornada e revolucionário.', target: 'humanizar' },
  { category: 'Bônus', title: 'Transformador de prompt fraco em prompt profissional', when: 'Quando você sabe o que quer, mas pediu de forma genérica.', target: 'oferta' },
];

function App() {
  const [page, setPage] = useState<Page>('home');
  const [category, setCategory] = useState<PromptCategory>('reels');
  const [form, setForm] = useState<PromptForm>(initialForm);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [accessMessage, setAccessMessage] = useState('');

  const selectedTemplate = useMemo(() => templates.find((item) => item.id === category) ?? templates[0], [category]);

  function navigate(next: Page) {
    setPage(next);
    setCopyStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateField(field: keyof PromptForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function loadExample() {
    setForm(selectedTemplate.example);
    setGeneratedPrompt('');
  }

  function generatePrompt(event?: FormEvent) {
    event?.preventDefault();
    setGeneratedPrompt(buildPrompt(selectedTemplate, form));
  }

  async function copyText(text: string) {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Prompt copiado.');
    } catch {
      setCopyStatus('Selecione e copie manualmente.');
    }
    window.setTimeout(() => setCopyStatus(''), 2200);
  }

  function activateAccess(event: FormEvent) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    const plan = accessCodes[normalized];

    if (!email.includes('@')) {
      setAccessMessage('Informe o e-mail usado na compra.');
      return;
    }

    if (!plan) {
      setAccessMessage('Código inválido. Confira se digitou corretamente.');
      return;
    }

    localStorage.setItem(
      'comando-pronto-ia-access',
      JSON.stringify({ email, code: normalized, plan, activatedAt: new Date().toISOString() }),
    );
    setAccessMessage(`Acesso ativado com sucesso: ${plan}.`);
    window.setTimeout(() => navigate('gerador'), 900);
  }

  function useFromLibrary(target: PromptCategory = 'reels') {
    setCategory(target);
    navigate('gerador');
  }

  return (
    <div className="app-shell">
      <Header page={page} navigate={navigate} />
      <main>
        {page === 'home' && <HomePage navigate={navigate} />}
        {page === 'gerador' && (
          <GeneratorPage
            category={category}
            setCategory={setCategory}
            form={form}
            updateField={updateField}
            selectedTemplate={selectedTemplate}
            generatedPrompt={generatedPrompt}
            generatePrompt={generatePrompt}
            copyText={copyText}
            copyStatus={copyStatus}
            loadExample={loadExample}
            clear={() => {
              setForm(initialForm);
              setGeneratedPrompt('');
            }}
          />
        )}
        {page === 'biblioteca' && <LibraryPage useFromLibrary={useFromLibrary} />}
        {page === 'guia' && <GuidePage />}
        {page === 'planos' && <PricingPage navigate={navigate} />}
        {page === 'ativar' && (
          <ActivatePage
            email={email}
            code={code}
            setEmail={setEmail}
            setCode={setCode}
            message={accessMessage}
            onSubmit={activateAccess}
          />
        )}
        {page === 'obrigado' && <ThankYouPage navigate={navigate} />}
      </main>
      <Footer />
    </div>
  );
}

function Header({ page, navigate }: { page: Page; navigate: (page: Page) => void }) {
  const items: { page: Page; label: string }[] = [
    { page: 'home', label: 'Início' },
    { page: 'gerador', label: 'Gerador' },
    { page: 'biblioteca', label: 'Biblioteca' },
    { page: 'guia', label: 'Guia' },
    { page: 'planos', label: 'Planos' },
  ];

  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('home')} aria-label="Ir para início">
        <span className="brand-icon">⌘</span>
        <span>Comando Pronto IA</span>
      </button>
      <nav className="nav-links" aria-label="Navegação principal">
        {items.map((item) => (
          <button className={page === item.page ? 'active' : ''} key={item.page} onClick={() => navigate(item.page)}>
            {item.label}
          </button>
        ))}
        <button className="nav-cta" onClick={() => navigate('ativar')}>
          Ativar acesso
        </button>
      </nav>
    </header>
  );
}

function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Prompts guiados • conteúdo • venda • WhatsApp</span>
          <h1>Você não precisa aprender IA. Só precisa copiar o comando certo.</h1>
          <p>
            Preencha campos simples e gere prompts profissionais para criar posts, roteiros, anúncios e mensagens de
            venda no ChatGPT, Gemini ou Claude.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate('gerador')}>
              Começar agora
            </button>
            <button className="secondary-button" onClick={() => navigate('biblioteca')}>
              Ver exemplos
            </button>
          </div>
        </div>

        <div className="hero-card">
          <span className="ai-label">Antes</span>
          <div className="bad-prompt">“Faça um post sobre meu produto.”</div>
          <span className="ai-label good">Depois</span>
          <div className="good-prompt">
            Crie um post para [público], que sofre com [dor], deseja [resultado], usando tom [tom], com gancho forte,
            exemplo real e CTA para [ação].
          </div>
        </div>
      </section>

      <section className="pain-section">
        <div className="section-heading">
          <span className="eyebrow">A dor real</span>
          <h2>O problema não é a ferramenta. É o comando.</h2>
          <p>
            Você abre a IA, pede um post e recebe um texto bonito, mas vazio. Isso acontece porque faltam contexto,
            público, dor, canal, tom e formato de saída.
          </p>
        </div>
      </section>

      <section className="steps-grid">
        {['Escolha o que quer criar', 'Preencha os dados do seu negócio', 'Gere o comando pronto', 'Cole na sua IA favorita'].map(
          (step, index) => (
            <article className="step-card" key={step}>
              <span>{index + 1}</span>
              <h3>{step}</h3>
              <p>
                Um fluxo simples para sair da tela em branco e obter respostas menos genéricas, sem depender de
                programação.
              </p>
            </article>
          ),
        )}
      </section>

      <section className="benefits-grid">
        {[
          'Sair da tela em branco',
          'Evitar textos com cara de robô',
          'Criar conteúdo mais rápido',
          'Vender melhor pelo WhatsApp',
          'Criar anúncios com estrutura',
          'Transformar ideias soltas em prompts úteis',
        ].map((benefit) => (
          <article className="feature-card" key={benefit}>
            <h3>{benefit}</h3>
            <p>Use estruturas preenchíveis em vez de comandos vagos que geram respostas repetidas.</p>
          </article>
        ))}
      </section>

      <section className="conversion-section">
        <span className="eyebrow">O que você recebe</span>
        <h2>15 Prompts-Mestre + bônus anti-texto-robótico.</h2>
        <ul className="check-list">
          <li>Prompts para posts, Reels, legendas e calendário.</li>
          <li>Prompts para oferta, anúncio, página de venda e objeções.</li>
          <li>Prompts para WhatsApp, follow-up e fechamento consultivo.</li>
          <li>Exemplos preenchidos e botão de copiar no gerador.</li>
        </ul>
        <button className="primary-button" onClick={() => navigate('planos')}>
          Ver planos
        </button>
      </section>
    </>
  );
}

function GeneratorPage({
  category,
  setCategory,
  form,
  updateField,
  selectedTemplate,
  generatedPrompt,
  generatePrompt,
  copyText,
  copyStatus,
  loadExample,
  clear,
}: {
  category: PromptCategory;
  setCategory: (category: PromptCategory) => void;
  form: PromptForm;
  updateField: (field: keyof PromptForm, value: string) => void;
  selectedTemplate: PromptTemplate;
  generatedPrompt: string;
  generatePrompt: (event?: FormEvent) => void;
  copyText: (text: string) => void;
  copyStatus: string;
  loadExample: () => void;
  clear: () => void;
}) {
  const fields: { key: keyof PromptForm; label: string; placeholder: string; textarea?: boolean }[] = [
    { key: 'nicho', label: 'Nicho', placeholder: 'Ex.: estética, confeitaria, social media' },
    { key: 'produto', label: 'Produto ou serviço', placeholder: 'Ex.: limpeza de pele, consultoria, template' },
    { key: 'publico', label: 'Público-alvo', placeholder: 'Ex.: mulheres de 25 a 45 anos' },
    { key: 'dor', label: 'Principal dor', placeholder: 'Ex.: não sabe postar com constância' },
    { key: 'desejo', label: 'Principal desejo', placeholder: 'Ex.: atrair clientes pelo Instagram' },
    { key: 'tom', label: 'Tom de voz', placeholder: 'Ex.: direto, popular, elegante, consultivo' },
    { key: 'canal', label: 'Canal', placeholder: 'Ex.: Instagram, TikTok, WhatsApp, página de venda' },
    { key: 'objetivo', label: 'Objetivo', placeholder: 'Ex.: gerar leads, vender, educar, agendar' },
    { key: 'observacoes', label: 'Observações adicionais', placeholder: 'Ex.: não usar emojis; focar em dor financeira', textarea: true },
  ];

  return (
    <section className="page-section">
      <div className="section-heading">
        <span className="eyebrow">Gerador Interativo</span>
        <h1>Gere um comando profissional em poucos campos.</h1>
        <p>Escolha uma categoria, preencha os dados do negócio e copie o prompt final para usar na IA de sua preferência.</p>
      </div>

      <div className="generator-layout">
        <form className="prompt-form" onSubmit={generatePrompt}>
          <label>
            Categoria
            <select value={category} onChange={(event) => setCategory(event.target.value as PromptCategory)}>
              {templates.map((template) => (
                <option value={template.id} key={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
          </label>

          <p className="template-description">{selectedTemplate.description}</p>

          <div className="form-grid">
            {fields.map((field) => (
              <label key={field.key}>
                {field.label}
                {field.textarea ? (
                  <textarea
                    value={form[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    value={form[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="form-footer">
            <button className="primary-button" type="submit">
              Gerar comando
            </button>
            <button className="secondary-button" type="button" onClick={loadExample}>
              Usar exemplo
            </button>
            <button className="secondary-button" type="button" onClick={clear}>
              Limpar campos
            </button>
          </div>
        </form>

        <aside className="result-card">
          <span className="eyebrow">Resultado</span>
          <h2>Seu prompt pronto</h2>
          {generatedPrompt ? (
            <>
              <pre>{generatedPrompt}</pre>
              <button className="copy-button" onClick={() => copyText(generatedPrompt)}>
                Copiar prompt
              </button>
              {copyStatus && <p className="copy-status">{copyStatus}</p>}
            </>
          ) : (
            <p>Preencha os campos e clique em “Gerar comando”. O resultado aparecerá aqui.</p>
          )}
          <div className="usage-box">
            <h3>Como usar</h3>
            <p>Cole o comando no ChatGPT, Gemini ou Claude. Depois peça: “deixe mais humano”, “crie 3 variações” ou “remova clichês”.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function LibraryPage({ useFromLibrary }: { useFromLibrary: (target?: PromptCategory) => void }) {
  return (
    <section className="page-section">
      <div className="section-heading">
        <span className="eyebrow">Biblioteca</span>
        <h1>15 Prompts-Mestre + 3 bônus.</h1>
        <p>Use a biblioteca como mapa rápido do que o sistema consegue gerar.</p>
      </div>
      <div className="library-grid">
        {libraryItems.map((item) => (
          <article className="library-card" key={`${item.category}-${item.title}`}>
            <span className="badge">{item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.when}</p>
            <button className="secondary-button" onClick={() => useFromLibrary(item.target)}>
              Usar no gerador
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function GuidePage() {
  return (
    <section className="page-section narrow">
      <span className="eyebrow">Guia rápido</span>
      <h1>Como obter respostas melhores da IA.</h1>
      <div className="guide-stack">
        <article>
          <h2>O que é um comando bom?</h2>
          <p>Um comando bom informa papel da IA, contexto, público, dor, desejo, objetivo, canal, tom, formato de saída e restrições.</p>
        </article>
        <article>
          <h2>Por que prompts genéricos falham?</h2>
          <p>Porque a IA não lê sua mente. Quando você pede “faça um post”, ela completa as lacunas com frases genéricas.</p>
        </article>
        <article>
          <h2>Peça ajustes depois da primeira resposta</h2>
          <ul className="check-list">
            <li>Deixe mais direto.</li>
            <li>Deixe mais humano.</li>
            <li>Crie 3 variações.</li>
            <li>Remova clichês.</li>
            <li>Adapte para Reels.</li>
          </ul>
        </article>
        <article>
          <h2>Erros comuns</h2>
          <p>Pedir sem contexto, não definir público, ignorar a dor, não informar o canal e aceitar a primeira resposta sem revisar.</p>
        </article>
      </div>
    </section>
  );
}

function PricingPage({ navigate }: { navigate: (page: Page) => void }) {
  const plans = [
    {
      name: 'Kit Inicial',
      price: 'R$27',
      link: checkoutLinks.plan27,
      features: ['15 prompts-mestre', 'Exemplos preenchidos', 'Guia rápido', 'Bônus anti-texto-robótico'],
    },
    {
      name: 'Gerador Interativo',
      price: 'R$47',
      link: checkoutLinks.plan47,
      featured: true,
      features: ['Tudo do R$27', 'Gerador de prompts', 'Biblioteca organizada', 'Botão copiar', 'Exemplos por categoria'],
    },
    {
      name: 'Comando Pro',
      price: 'R$97',
      link: checkoutLinks.plan97,
      features: ['Tudo do R$47', 'Calendário de conteúdo', 'Prompts para página de venda', 'WhatsApp', 'Oferta e objeções'],
    },
  ];

  return (
    <section className="page-section">
      <div className="section-heading">
        <span className="eyebrow">Planos</span>
        <h1>Comece simples. Evolua quando validar.</h1>
        <p>Os links da Kiwify estão centralizados no código para troca rápida quando os checkouts estiverem prontos.</p>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={`plan-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>
            <span className="badge">{plan.name}</span>
            <h2>{plan.price}</h2>
            <ul className="check-list">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a className="primary-button" href={plan.link}>
              Comprar {plan.price}
            </a>
          </article>
        ))}
      </div>
      <div className="conversion-section">
        <h2>Já comprou?</h2>
        <p>Use o código recebido para liberar o acesso ao gerador.</p>
        <button className="secondary-button" onClick={() => navigate('ativar')}>
          Ativar acesso
        </button>
      </div>
    </section>
  );
}

function ActivatePage({
  email,
  code,
  setEmail,
  setCode,
  message,
  onSubmit,
}: {
  email: string;
  code: string;
  setEmail: (value: string) => void;
  setCode: (value: string) => void;
  message: string;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <section className="page-section narrow">
      <div className="section-heading">
        <span className="eyebrow">Ativação</span>
        <h1>Libere seu acesso.</h1>
        <p>Use o e-mail da compra e o código de acesso. Códigos de teste: COMANDO27, COMANDO47 ou COMANDO97.</p>
      </div>
      <form className="prompt-form" onSubmit={onSubmit}>
        <label>
          E-mail da compra
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seunome@email.com" />
        </label>
        <label>
          Código de acesso
          <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="COMANDO27" />
        </label>
        <button className="primary-button" type="submit">
          Ativar acesso
        </button>
        {message && <p className="copy-status">{message}</p>}
      </form>
    </section>
  );
}

function ThankYouPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="page-section narrow empty-state">
      <span className="eyebrow">Compra quase pronta</span>
      <h1>Após finalizar o pagamento, use seu código de acesso.</h1>
      <p>Quando tiver o código, volte para a tela de ativação e libere o sistema.</p>
      <div className="hero-actions">
        <button className="primary-button" onClick={() => navigate('ativar')}>
          Ativar acesso
        </button>
        <button className="secondary-button" onClick={() => navigate('guia')}>
          Ver guia
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>O Comando Pronto IA gera prompts para você usar na IA de sua preferência. Revise sempre antes de publicar.</p>
    </footer>
  );
}

function buildPrompt(template: PromptTemplate, form: PromptForm) {
  const data = {
    nicho: form.nicho || '[preencha o nicho]',
    produto: form.produto || '[preencha o produto ou serviço]',
    publico: form.publico || '[preencha o público-alvo]',
    dor: form.dor || '[preencha a principal dor]',
    desejo: form.desejo || '[preencha o principal desejo]',
    tom: form.tom || '[preencha o tom de voz]',
    canal: form.canal || '[preencha o canal]',
    objetivo: form.objetivo || '[preencha o objetivo]',
    observacoes: form.observacoes || 'Sem observações adicionais.',
  };

  return `${template.role}

Contexto do negócio:
- Nicho: ${data.nicho}
- Produto ou serviço: ${data.produto}
- Público-alvo: ${data.publico}
- Principal dor do público: ${data.dor}
- Principal desejo do público: ${data.desejo}
- Tom de voz: ${data.tom}
- Canal: ${data.canal}
- Objetivo: ${data.objetivo}
- Observações adicionais: ${data.observacoes}

Tarefa:
${template.output}

Regras obrigatórias:
- Não use linguagem genérica de IA.
- Não use palavras como "potencialize", "revolucionário", "desbloqueie", "jornada" e "transformador".
- Não prometa resultado garantido.
- Use exemplos práticos e situações reais do público.
- Escreva com clareza, sem enrolação.
- Adapte a estrutura ao canal informado.
- Termine com uma ação clara para o leitor.

Critérios de qualidade:
- O texto deve parecer escrito para o público informado, não para qualquer pessoa.
- A dor precisa aparecer de forma concreta.
- A resposta deve ter aplicação imediata.
- Se a informação estiver vaga, faça uma suposição simples e avise no final.`;
}

export default App;
