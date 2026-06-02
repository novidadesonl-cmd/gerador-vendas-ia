import { FormEvent, useMemo, useState } from 'react';

type Page = 'home' | 'sample' | 'result' | 'plans' | 'starterKit' | 'salesClarityKit';

type FormData = {
  nome: string;
  email: string;
  produto: string;
  publico: string;
  dor: string;
  beneficio: string;
  tom: string;
  canal: string;
};

type ResultBlock = {
  title: string;
  content: string;
};

const initialForm: FormData = {
  nome: '',
  email: '',
  produto: '',
  publico: '',
  dor: '',
  beneficio: '',
  tom: 'Direto e persuasivo',
  canal: 'Instagram',
};

const planLinks = {
  express: 'https://pay.kiwify.com.br/XrpQAEr',
  complete: 'https://pay.kiwify.com.br/5VBTVxR',
  days: 'https://pay.kiwify.com.br/MA8CXB2',
};

function App() {
  const [page, setPage] = useState<Page>('home');
  const [form, setForm] = useState<FormData>(initialForm);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const resultBlocks = useMemo(
    () => (submittedData ? generateSample(submittedData) : []),
    [submittedData],
  );
  const starterKitBlocks = useMemo(
    () => (submittedData ? generateStarterKit(submittedData) : []),
    [submittedData],
  );
  const salesClarityBlocks = useMemo(
    () => (submittedData ? generateSalesClarityKit(submittedData) : []),
    [submittedData],
  );

  const goTo = (nextPage: Page) => {
    setCopiedBlock(null);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedData(form);
    goTo('result');
  };

  const copyBlock = async (block: ResultBlock) => {
    const text = `${block.title}\n\n${block.content}`;
    await navigator.clipboard.writeText(text);
    setCopiedBlock(block.title);
    window.setTimeout(() => setCopiedBlock(null), 1800);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => goTo('home')} aria-label="Ir para a página inicial">
          <span className="brand-icon">✦</span>
          <span>Gerador de Vendas IA</span>
        </button>

        <nav className="nav-links" aria-label="Navegação principal">
          <button onClick={() => goTo('home')}>Início</button>
          <button onClick={() => goTo('sample')}>Amostra grátis</button>
          <button onClick={() => goTo('plans')}>Planos</button>
        </nav>
      </header>

      <main>
        {page === 'home' && <HomePage onStart={() => goTo('sample')} onPlans={() => goTo('plans')} />}
        {page === 'sample' && (
          <SampleForm form={form} setForm={setForm} onSubmit={handleSubmit} />
        )}
        {page === 'result' && submittedData && (
          <ResultPage
            data={submittedData}
            blocks={resultBlocks}
            copiedBlock={copiedBlock}
            onCopy={copyBlock}
            onPlans={() => goTo('plans')}
            onNewSample={() => goTo('sample')}
          />
        )}
        {page === 'result' && !submittedData && <EmptyResult onStart={() => goTo('sample')} />}
        {page === 'starterKit' && submittedData && (
          <StarterKitPage
            data={submittedData}
            blocks={starterKitBlocks}
            copiedBlock={copiedBlock}
            onCopy={copyBlock}
            onPlans={() => goTo('plans')}
            onNewSample={() => goTo('sample')}
          />
        )}
        {page === 'starterKit' && !submittedData && <EmptyStarterKit onStart={() => goTo('sample')} />}
        {page === 'salesClarityKit' && submittedData && (
          <SalesClarityKitPage
            data={submittedData}
            blocks={salesClarityBlocks}
            copiedBlock={copiedBlock}
            onCopy={copyBlock}
            onPlans={() => goTo('plans')}
            onNewSample={() => goTo('sample')}
          />
        )}
        {page === 'salesClarityKit' && !submittedData && <EmptySalesClarityKit onStart={() => goTo('sample')} />}
        {page === 'plans' && (
          <PlansPage
            onViewStarterKit={() => goTo(submittedData ? 'starterKit' : 'sample')}
            onViewSalesClarityKit={() => goTo(submittedData ? 'salesClarityKit' : 'sample')}
          />
        )}
      </main>
    </div>
  );
}

function HomePage({ onStart, onPlans }: { onStart: () => void; onPlans: () => void }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Conteúdo pronto para vender • sem copy • sem prompt</span>
          <h1>Crie conteúdos de venda prontos em poucos minutos, mesmo sem saber escrever copy.</h1>
          <p>
            Informe o que você vende e receba uma amostra com diagnóstico, roteiro de Reels,
            mensagem de WhatsApp, headline e CTA prontos para usar.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onStart}>
              Gerar amostra grátis
            </button>
            <button className="secondary-button" onClick={onPlans}>
              Ver pacotes completos
            </button>
          </div>
        </div>

        <div className="hero-card" aria-label="Prévia da ferramenta">
          <div className="terminal-bar">
            <span />
            <span />
            <span />
          </div>
          <p className="ai-label">Amostra comercial</p>
          <h2>Sem travar na página em branco</h2>
          <ul>
            <li>Diagnóstico da oferta</li>
            <li>Roteiro de Reels pronto</li>
            <li>Mensagem de WhatsApp pronta</li>
            <li>Headline e CTA prontos</li>
          </ul>
          <div className="pulse-card">Você informa a oferta. A página entrega a estrutura.</div>
        </div>
      </section>

      <section className="feature-grid" aria-label="Benefícios principais">
        {[
          ['Diagnóstico rápido', 'Entenda o que precisa ficar mais claro na sua oferta antes de publicar.'],
          ['Conteúdo pronto', 'Receba textos para Reels, WhatsApp, headline e CTA sem estudar copywriting.'],
          ['Venda com clareza', 'Copie a amostra, adapte se quiser e teste sua mensagem com mais segurança.'],
        ].map(([title, text]) => (
          <article className="feature-card" key={title}>
            <span className="feature-icon">✧</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="conversion-section" aria-labelledby="como-funciona">
        <div className="section-heading">
          <span className="eyebrow">Como funciona</span>
          <h2 id="como-funciona">Da sua oferta ao conteúdo pronto em 3 passos</h2>
          <p>Não precisa criar prompt, montar roteiro do zero ou saber fórmulas de copy.</p>
        </div>
        <div className="steps-grid">
          {[
            ['1', 'Informe os dados da sua oferta', 'Preencha produto, público, dor, benefício e canal principal.'],
            ['2', 'Receba uma amostra personalizada', 'Veja diagnóstico, roteiro, WhatsApp, headline e CTA gerados a partir das suas respostas.'],
            ['3', 'Copie, publique e venda com mais clareza', 'Use o conteúdo como ponto de partida para divulgar sua oferta sem travar.'],
          ].map(([number, title, text]) => (
            <article className="step-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="conversion-section audience-section" aria-labelledby="para-quem-e">
        <div className="section-heading">
          <span className="eyebrow">Para quem é</span>
          <h2 id="para-quem-e">Feito para quem vende online e precisa de mensagens mais claras</h2>
          <p>Use para transformar uma ideia de oferta em conteúdo comercial direto e fácil de publicar.</p>
        </div>
        <div className="audience-list">
          {['Afiliados', 'Infoprodutores', 'Prestadores de serviço', 'Pequenos negócios', 'Vendedores pelo WhatsApp'].map(
            (audience) => (
              <span key={audience}>{audience}</span>
            ),
          )}
        </div>
      </section>
    </>
  );
}

function SampleForm({
  form,
  setForm,
  onSubmit,
}: {
  form: FormData;
  setForm: (form: FormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const updateField = (field: keyof FormData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <section className="form-section">
      <div className="section-heading">
        <span className="eyebrow">Amostra grátis</span>
        <h1>Conte sobre sua oferta</h1>
        <p>Use respostas objetivas. A simulação vai adaptar a linguagem aos dados informados.</p>
      </div>

      <form className="sample-form" onSubmit={onSubmit}>
        <Field label="Nome" value={form.nome} onChange={(value) => updateField('nome', value)} />
        <Field
          label="E-mail"
          type="email"
          value={form.email}
          onChange={(value) => updateField('email', value)}
        />
        <Field label="Produto" value={form.produto} onChange={(value) => updateField('produto', value)} />
        <Field label="Público" value={form.publico} onChange={(value) => updateField('publico', value)} />
        <Field
          label="Dor principal"
          value={form.dor}
          onChange={(value) => updateField('dor', value)}
        />
        <Field
          label="Benefício principal"
          value={form.beneficio}
          onChange={(value) => updateField('beneficio', value)}
        />

        <label>
          Tom de comunicação
          <select value={form.tom} onChange={(event) => updateField('tom', event.target.value)}>
            <option>Direto e persuasivo</option>
            <option>Consultivo e educativo</option>
            <option>Emocional e aspiracional</option>
            <option>Leve e descontraído</option>
          </select>
        </label>

        <label>
          Canal principal
          <select value={form.canal} onChange={(event) => updateField('canal', event.target.value)}>
            <option>Instagram</option>
            <option>Reels</option>
            <option>WhatsApp</option>
            <option>Anúncios pagos</option>
            <option>Página de venda</option>
          </select>
        </label>

        <div className="form-footer">
          <p>Ao enviar, você verá uma amostra simulada. Nenhum dado será salvo.</p>
          <button className="primary-button" type="submit">
            Gerar resultado grátis
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      {label}
      <input
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Digite ${label.toLowerCase()}`}
      />
    </label>
  );
}

function ResultPage({
  data,
  blocks,
  copiedBlock,
  onCopy,
  onPlans,
  onNewSample,
}: {
  data: FormData;
  blocks: ResultBlock[];
  copiedBlock: string | null;
  onCopy: (block: ResultBlock) => void;
  onPlans: () => void;
  onNewSample: () => void;
}) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <span className="eyebrow">Resultado da amostra</span>
        <h1>{data.nome}, sua prévia comercial está pronta.</h1>
        <p>
          Este é um resultado simulado para validar a ferramenta. O pacote completo aprofunda
          variações, calendário e textos por canal.
        </p>
      </div>

      <BlockGrid blocks={blocks} copiedBlock={copiedBlock} onCopy={onCopy} />

      <div className="upgrade-banner">
        <div>
          <span className="eyebrow">Próximo passo</span>
          <h2>Quer transformar essa amostra em um kit completo de vendas?</h2>
          <p>Escolha um plano com mais peças, variações e conteúdo pronto para publicar.</p>
        </div>
        <div className="banner-actions">
          <button className="secondary-button" onClick={onNewSample}>
            Editar dados
          </button>
          <button className="primary-button" onClick={onPlans}>
            Ver planos
          </button>
        </div>
      </div>
    </section>
  );
}

function StarterKitPage({
  data,
  blocks,
  copiedBlock,
  onCopy,
  onPlans,
  onNewSample,
}: {
  data: FormData;
  blocks: ResultBlock[];
  copiedBlock: string | null;
  onCopy: (block: ResultBlock) => void;
  onPlans: () => void;
  onNewSample: () => void;
}) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <span className="eyebrow">Exemplo do plano R$27</span>
        <h1>{data.nome}, veja o que o Começar Agora pode entregar.</h1>
        <p>
          Este é um exemplo simulado do kit de entrada: diagnóstico objetivo, headlines, CTAs,
          mensagens curtas, ideias de post e um roteiro curto de Reels.
        </p>
      </div>

      <BlockGrid blocks={blocks} copiedBlock={copiedBlock} onCopy={onCopy} />

      <div className="upgrade-banner">
        <div>
          <span className="eyebrow">Começar Agora</span>
          <h2>Quer receber esse kit para a sua oferta?</h2>
          <p>Compre o plano R$27 para tirar sua oferta da página em branco com peças iniciais de venda.</p>
        </div>
        <div className="banner-actions">
          <button className="secondary-button" onClick={onNewSample}>
            Editar dados
          </button>
          <a className="primary-button" href={planLinks.express} target="_blank" rel="noreferrer">
            Comprar por R$27
          </a>
          <button className="secondary-button" onClick={onPlans}>
            Ver planos
          </button>
        </div>
      </div>
    </section>
  );
}

function SalesClarityKitPage({
  data,
  blocks,
  copiedBlock,
  onCopy,
  onPlans,
  onNewSample,
}: {
  data: FormData;
  blocks: ResultBlock[];
  copiedBlock: string | null;
  onCopy: (block: ResultBlock) => void;
  onPlans: () => void;
  onNewSample: () => void;
}) {
  return (
    <section className="result-section">
      <div className="section-heading">
        <span className="eyebrow">Exemplo do plano R$47</span>
        <h1>{data.nome}, veja o que o Vender com Clareza pode entregar.</h1>
        <p>
          Este é um exemplo simulado do kit completo: diagnóstico comercial, ângulos de venda,
          roteiros de Reels, mensagens de WhatsApp, headlines, CTAs e respostas para objeções.
        </p>
      </div>

      <BlockGrid blocks={blocks} copiedBlock={copiedBlock} onCopy={onCopy} />

      <div className="upgrade-banner">
        <div>
          <span className="eyebrow">Vender com Clareza</span>
          <h2>Quer receber o kit completo para a sua oferta?</h2>
          <p>Compre o plano R$47 para transformar sua oferta em mensagens, roteiros e argumentos prontos.</p>
        </div>
        <div className="banner-actions">
          <button className="secondary-button" onClick={onNewSample}>
            Editar dados
          </button>
          <a className="primary-button" href={planLinks.complete} target="_blank" rel="noreferrer">
            Comprar por R$47
          </a>
          <button className="secondary-button" onClick={onPlans}>
            Ver planos
          </button>
        </div>
      </div>
    </section>
  );
}

function BlockGrid({
  blocks,
  copiedBlock,
  onCopy,
}: {
  blocks: ResultBlock[];
  copiedBlock: string | null;
  onCopy: (block: ResultBlock) => void;
}) {
  return (
    <div className="result-grid">
      {blocks.map((block) => (
        <article className="result-card" key={block.title}>
          <div className="result-card-header">
            <h2>{block.title}</h2>
            <button className="copy-button" onClick={() => onCopy(block)}>
              {copiedBlock === block.title ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <p style={{ whiteSpace: 'pre-line' }}>{block.content}</p>
        </article>
      ))}
    </div>
  );
}

function EmptyResult({ onStart }: { onStart: () => void }) {
  return (
    <section className="empty-state">
      <h1>Você ainda não gerou uma amostra.</h1>
      <p>Preencha o formulário para receber seu conteúdo de venda simulado.</p>
      <button className="primary-button" onClick={onStart}>
        Começar agora
      </button>
    </section>
  );
}

function EmptyStarterKit({ onStart }: { onStart: () => void }) {
  return (
    <section className="empty-state">
      <h1>Preencha sua oferta antes de ver o exemplo do plano.</h1>
      <p>O plano Começar Agora usa os dados da sua oferta para montar o kit inicial.</p>
      <button className="primary-button" onClick={onStart}>
        Preencher minha oferta
      </button>
    </section>
  );
}

function EmptySalesClarityKit({ onStart }: { onStart: () => void }) {
  return (
    <section className="empty-state">
      <h1>Preencha sua oferta antes de ver o exemplo do plano completo.</h1>
      <p>O plano Vender com Clareza usa os dados da sua oferta para montar um kit comercial mais robusto.</p>
      <button className="primary-button" onClick={onStart}>
        Preencher minha oferta
      </button>
    </section>
  );
}

function PlansPage({
  onViewStarterKit,
  onViewSalesClarityKit,
}: {
  onViewStarterKit: () => void;
  onViewSalesClarityKit: () => void;
}) {
  const plans = [
    {
      name: 'Começar Agora',
      price: 'R$27',
      description: 'Gere as primeiras peças para tirar sua oferta da página em branco.',
      features: [
        'Diagnóstico objetivo da oferta',
        'Headline e CTA prontos para usar',
        'Mensagem curta para WhatsApp ou direct',
        'Indicado para validar uma promessa específica',
      ],
      link: planLinks.express,
      preview: 'starter',
    },
    {
      name: 'Vender com Clareza',
      price: 'R$47',
      description: 'Transforme sua oferta em posts, roteiros, mensagens e copies prontas para vender.',
      features: [
        'Diagnóstico comercial mais completo',
        'Roteiros de Reels com gancho, problema, solução e CTA',
        'Mensagens de WhatsApp prontas para abordagem e follow-up',
        'Headlines, CTAs, ângulos e respostas para objeções',
      ],
      link: planLinks.complete,
      featured: true,
      preview: 'clarity',
    },
    {
      name: '30 Dias de Conteúdo',
      price: 'R$97',
      description: 'Receba uma estrutura mensal para manter constância e vender com mais frequência.',
      features: [
        'Calendário mensal de publicações',
        'Ideias por etapa do funil de venda',
        'Chamadas diárias para ação',
        'Sugestões para alternar posts, Reels e WhatsApp',
      ],
      link: planLinks.days,
    },
  ];

  return (
    <section className="plans-section">
      <div className="section-heading">
        <span className="eyebrow">Planos</span>
        <h1>Escolha o pacote certo para receber conteúdo pronto de venda</h1>
        <p>Comece com o essencial, avance para o plano recomendado ou planeje 30 dias de conteúdo.</p>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <article className={`plan-card ${plan.featured ? 'featured-plan' : ''}`} key={plan.name}>
            {plan.featured && <span className="badge">Recomendado</span>}
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <strong>{plan.price}</strong>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {plan.preview === 'starter' && (
              <button className="secondary-button plan-button" onClick={onViewStarterKit}>
                Ver exemplo do que recebo
              </button>
            )}
            {plan.preview === 'clarity' && (
              <button className="secondary-button plan-button" onClick={onViewSalesClarityKit}>
                Ver exemplo do kit completo
              </button>
            )}
            <a className="primary-button plan-button" href={plan.link} target="_blank" rel="noreferrer">
              Comprar agora
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function generateStarterKit(data: FormData): ResultBlock[] {
  const produto = data.produto.trim();
  const publico = data.publico.trim();
  const dor = data.dor.trim();
  const beneficio = data.beneficio.trim();

  return [
    {
      title: '1. Diagnóstico objetivo da oferta',
      content: `${produto} tem potencial porque resolve uma dificuldade clara de ${publico}: ${dor}. Para vender melhor, a comunicação precisa mostrar a situação antes, o custo de continuar parado e o ganho prático de alcançar ${beneficio}.`,
    },
    {
      title: '2. Três headlines prontas',
      content: `1. ${beneficio} sem deixar ${dor} travar sua venda.\n\n2. Pare de explicar sua oferta de qualquer jeito e mostre por que ${produto} importa.\n\n3. Transforme uma oferta confusa em uma mensagem simples, direta e pronta para vender.`,
    },
    {
      title: '3. Três CTAs prontos',
      content: `1. Quero começar agora.\n\n2. Me envie o próximo passo.\n\n3. Quero tirar minha oferta da página em branco.`,
    },
    {
      title: '4. Três mensagens curtas para WhatsApp ou direct',
      content: `1. Oi, tudo bem? Vi que muita gente trava na hora de vender porque não sabe como explicar a própria oferta. O ${produto} ajuda a organizar essa mensagem de forma mais clara. Quer que eu te mostre?\n\n2. Você já tem uma oferta, mas sente que a comunicação ainda não está clara? Posso te mostrar uma forma simples de transformar isso em conteúdo de venda.\n\n3. Se hoje ${dor} está dificultando sua venda, o ${produto} pode ajudar você a chegar em ${beneficio} com uma mensagem mais direta. Quer entender como funciona?`,
    },
    {
      title: '5. Três ideias de post',
      content: `1. Post de dor: mostre o que acontece quando ${publico} tenta vender sem clareza.\n\n2. Post de antes e depois: compare uma oferta confusa com uma mensagem simples e objetiva.\n\n3. Post de convite: chame a pessoa para testar uma forma mais rápida de transformar a oferta em conteúdo pronto.`,
    },
    {
      title: '6. Um roteiro curto de Reels',
      content: `Gancho: Você tem uma oferta, mas trava na hora de explicar o que vende?\n\nProblema: Isso acontece porque muitas pessoas tentam vender sem organizar a dor, o benefício e a promessa principal.\n\nSolução: O ${produto} transforma essas informações em textos prontos para usar.\n\nCTA: Quer tirar sua oferta da página em branco? Comece agora.`,
    },
  ];
}

function generateSalesClarityKit(data: FormData): ResultBlock[] {
  const produto = data.produto.trim();
  const publico = data.publico.trim();
  const dor = data.dor.trim();
  const beneficio = data.beneficio.trim();
  const canal = data.canal.trim();

  return [
    {
      title: '1. Diagnóstico comercial completo',
      content: `${produto} precisa ser comunicado como uma solução direta para ${publico} que sofre com ${dor}. A força da oferta está em transformar essa dor em uma promessa clara: sair da confusão, entender o valor da solução e chegar em ${beneficio}. Para vender melhor, a mensagem deve mostrar o antes, o depois, o custo de não agir e o caminho simples para começar.`,
    },
    {
      title: '2. Três ângulos de venda',
      content: `1. Ângulo da dor: ${dor} está custando mais vendas, tempo ou clareza do que parece.\n\n2. Ângulo do antes e depois: antes, a oferta parece solta; depois, ${produto} mostra uma mensagem clara para chegar em ${beneficio}.\n\n3. Ângulo da simplicidade: você não precisa dominar copywriting para transformar sua oferta em textos prontos para vender.`,
    },
    {
      title: '3. Cinco roteiros de Reels',
      content: `1. Gancho: Sua oferta é boa, mas sua mensagem não vende?\nProblema: Muita gente tenta vender sem explicar a dor principal.\nSolução: O ${produto} organiza a promessa e mostra o próximo passo.\nCTA: Quer vender com mais clareza? Comece agora.\n\n2. Gancho: O cliente não compra o que ele não entende.\nProblema: Quando a oferta parece confusa, a decisão fica lenta.\nSolução: Transforme sua mensagem em roteiro, headline e CTA.\nCTA: Veja como o ${produto} pode ajudar.\n\n3. Gancho: Pare de postar sem direção.\nProblema: Conteúdo solto não cria desejo de compra.\nSolução: Use uma estrutura com dor, benefício e chamada para ação.\nCTA: Gere seu kit de venda.\n\n4. Gancho: Você sabe explicar em uma frase por que alguém deveria comprar?\nProblema: Se a resposta demora, a venda trava.\nSolução: O ${produto} ajuda a simplificar essa mensagem.\nCTA: Teste uma comunicação mais clara.\n\n5. Gancho: O problema não é só vender pouco. É vender sem clareza.\nProblema: Sem clareza, o público não entende o valor.\nSolução: Crie mensagens prontas para ${canal}.\nCTA: Quero vender com clareza.`,
    },
    {
      title: '4. Cinco mensagens de WhatsApp',
      content: `1. Oi, tudo bem? Vi que muitas ofertas travam porque a mensagem não deixa claro o valor. O ${produto} ajuda a organizar isso e criar textos mais diretos para vender. Quer que eu te mostre?\n\n2. Você sente que tem uma boa oferta, mas não sabe como apresentar? O ${produto} transforma os dados da sua oferta em mensagens, headlines e CTAs prontos.\n\n3. Se hoje ${dor} está dificultando suas vendas, talvez o primeiro passo seja ajustar a forma como a oferta é explicada. Quer ver um exemplo?\n\n4. O ${produto} foi criado para quem precisa vender com mais clareza, sem começar do zero toda vez que for divulgar. Quer conhecer o kit completo?\n\n5. Tenho uma forma simples de transformar sua oferta em roteiros, mensagens e chamadas de venda. Posso te enviar os detalhes?`,
    },
    {
      title: '5. Cinco headlines de venda',
      content: `1. Venda com mais clareza sem começar do zero.\n\n2. Transforme sua oferta em mensagens prontas para vender.\n\n3. Pare de travar na hora de explicar o que você vende.\n\n4. Crie roteiros, headlines e CTAs a partir da sua oferta.\n\n5. ${beneficio} com uma comunicação mais simples e direta.`,
    },
    {
      title: '6. Cinco CTAs prontos',
      content: `1. Quero vender com clareza.\n\n2. Gerar meu kit completo.\n\n3. Quero transformar minha oferta em conteúdo pronto.\n\n4. Me mostrar o próximo passo.\n\n5. Quero parar de travar na divulgação.`,
    },
    {
      title: '7. Respostas para objeções comuns',
      content: `1. "Não sei se isso funciona para mim."\nResposta: A estrutura parte dos dados da sua própria oferta, então os textos são gerados com base no que você vende, para quem vende e qual dor resolve.\n\n2. "Eu não sei usar IA."\nResposta: Você não precisa escrever prompt. Basta preencher os campos principais e usar os textos como ponto de partida.\n\n3. "Já tentei postar e não vendeu."\nResposta: Postar sem direção é diferente de comunicar uma oferta com dor, benefício e CTA. O foco aqui é clareza comercial.\n\n4. "Não tenho tempo para criar conteúdo."\nResposta: O objetivo é justamente reduzir o tempo de criação e entregar uma primeira estrutura pronta para adaptar e publicar.\n\n5. "Tenho medo de comprar e não usar."\nResposta: O plano foi desenhado para gerar peças práticas: roteiros, mensagens, headlines, CTAs, ângulos e objeções em um único kit.`,
    },
  ];
}

function generateSample(data: FormData): ResultBlock[] {
  const produto = data.produto.trim();
  const publico = data.publico.trim();
  const dor = data.dor.trim();
  const beneficio = data.beneficio.trim();
  const canal = data.canal.trim();
  const tom = data.tom.toLowerCase();
  const normalizarTexto = (texto: string) =>
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  const contexto = normalizarTexto(`${produto} ${publico} ${dor} ${beneficio}`);
  const isOfertaRural = [
    'safra',
    'produtor rural',
    'produtores rurais',
    'produtor',
    'agricultor',
    'agricultores',
    'custos',
    'custo por hectare',
    'lucro',
    'producao rural',
  ].some((termo) => contexto.includes(termo));

  if (isOfertaRural) {
    return [
      {
        title: '1. Diagnóstico rápido da oferta',
        content: `${produto} resolve uma dor concreta de ${publico}: trabalhar a safra inteira, vender a produção e ainda não saber quanto realmente sobrou. Na prática, isso aparece como ${dor}. A força da oferta está em mostrar que faturamento não é lucro: o produtor precisa enxergar custo por hectare, margem e lucro real antes de decidir a próxima safra.`,
      },
      {
        title: '2. Melhor ângulo de venda',
        content: `Você pode estar produzindo bem e ainda perdendo dinheiro sem perceber. Em ${canal}, esse ângulo combina com um tom ${tom} porque fala direto sobre dinheiro que entra versus dinheiro que sobra no fim da safra.`,
      },
      {
        title: '3. Roteiro de Reels',
        content: `Gancho: Você sabe quanto realmente sobra da sua safra depois de pagar tudo?\n\nProblema: Muitos produtores olham só para o valor da venda e acham que tiveram lucro.\n\nConsequência: Mas quando entram insumos, diesel, diárias, manutenção, máquinas e pequenos gastos, a conta muda.\n\nSolução: ${produto} organiza os custos e mostra o lucro real da produção, com mais clareza sobre ${beneficio}.\n\nCTA: Quer enxergar sua safra com mais clareza? Chame no WhatsApp.`,
      },
      {
        title: '4. Mensagem de WhatsApp',
        content: `Oi, tudo bem? Muitos produtores só descobrem se ganharam ou perderam dinheiro depois que a safra termina. O ${produto} ajuda a organizar os custos, enxergar o gasto por hectare e entender se a produção está dando lucro de verdade. Quer que eu te mostre como funciona?`,
      },
      {
        title: '5. Headline de venda',
        content: `Descubra se sua safra está dando lucro ou apenas girando dinheiro.`,
      },
      {
        title: '6. CTA para comprar o pacote completo',
        content: `Essa foi só uma amostra. No pacote completo, você recebe posts, roteiros, mensagens de WhatsApp, headlines e variações prontas para vender ${produto} com clareza sobre custos, produção e lucro real.`,
      },
    ];
  }

  return [
    {
      title: '1. Diagnóstico rápido da oferta',
      content: `${produto} resolve uma dor concreta de ${publico}: ${dor}. A comunicação deve mostrar onde essa dor aparece na rotina de compra, atendimento ou decisão do cliente, e ligar esse cenário ao benefício central: ${beneficio}. Quanto mais a promessa parecer uma situação real, mais fácil fica entender o valor da oferta.`,
    },
    {
      title: '2. Melhor ângulo de venda',
      content: `Para ${publico}, ${dor} não é apenas um incômodo: é o obstáculo que impede ${beneficio}. Em ${canal}, use um tom ${tom} para abrir a conversa com esse problema e apresentar ${produto} como o caminho mais claro para resolvê-lo.`,
    },
    {
      title: '3. Roteiro de Reels',
      content: `Gancho: ${publico} ainda perde vendas, energia ou previsibilidade por causa de ${dor}?\n\nProblema: Quando esse problema vira rotina, a pessoa tenta compensar no esforço e continua sem chegar em ${beneficio}.\n\nConsequência: O resultado é uma oferta mais difícil de explicar, uma decisão mais lenta e clientes sem perceberem o valor real do que está sendo vendido.\n\nSolução: ${produto} organiza a mensagem da oferta e mostra por que ${beneficio} é o próximo passo mais lógico.\n\nCTA: Quer ver como isso se aplica ao seu caso? Chame no WhatsApp.`,
    },
    {
      title: '4. Mensagem de WhatsApp',
      content: `Oi, tudo bem? Vi que ${dor} costuma atrapalhar bastante quem precisa vender com clareza. O ${produto} foi pensado para ajudar ${publico} a chegar em ${beneficio} com uma mensagem mais simples de entender e mais fácil de apresentar. Quer que eu te mostre como funciona?`,
    },
    {
      title: '5. Headline de venda',
      content: `${beneficio} sem deixar ${dor} travar sua venda.`,
    },
    {
      title: '6. CTA para comprar o pacote completo',
      content: `Essa foi só uma amostra. No pacote completo, você recebe posts, roteiros, mensagens de WhatsApp, headlines e variações prontas para vender ${produto} com mais clareza, mais contexto e argumentos comerciais adaptados ao seu público.`,
    },
  ];
}

export default App;
