import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';

type Page = 'home' | 'sample' | 'result' | 'plans';

type SampleFormData = {
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

const initialForm: SampleFormData = {
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
  express: 'https://pay.kiwify.com.br/kit-express-placeholder',
  complete: 'https://pay.kiwify.com.br/kit-venda-completo-placeholder',
  days: 'https://pay.kiwify.com.br/conteudo-30-dias-placeholder',
};

function App() {
  const [page, setPage] = useState<Page>('home');
  const [form, setForm] = useState<SampleFormData>(initialForm);
  const [submittedData, setSubmittedData] = useState<SampleFormData | null>(null);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const resultBlocks = useMemo(
    () => (submittedData ? generateSample(submittedData) : []),
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
        {page === 'plans' && <PlansPage />}
      </main>
    </div>
  );
}

function HomePage({ onStart, onPlans }: { onStart: () => void; onPlans: () => void }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">MVP visual • sem login • sem integração externa</span>
          <h1>Transforme dados do seu produto em uma amostra de venda pronta para validar.</h1>
          <p>
            Preencha um formulário simples e receba um diagnóstico, um ângulo comercial, um roteiro
            de Reels, uma mensagem de WhatsApp, uma headline e um CTA para vender melhor.
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
          <p className="ai-label">IA Comercial</p>
          <h2>Oferta detectada</h2>
          <ul>
            <li>Clareza da promessa</li>
            <li>Mensagem por canal</li>
            <li>Conteúdo com CTA</li>
          </ul>
          <div className="pulse-card">Amostra pronta em segundos</div>
        </div>
      </section>

      <section className="feature-grid">
        {[
          ['Diagnóstico rápido', 'Entenda o ponto forte da sua oferta e o que precisa ficar mais claro.'],
          ['Conteúdo prático', 'Receba textos simulados para Reels, WhatsApp e headline de venda.'],
          ['Validação simples', 'Teste a percepção do público antes de criar um pacote completo.'],
        ].map(([title, text]) => (
          <article className="feature-card" key={title}>
            <span className="feature-icon">✧</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function SampleForm({
  form,
  setForm,
  onSubmit,
}: {
  form: SampleFormData;
  setForm: Dispatch<SetStateAction<SampleFormData>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const updateField = (field: keyof SampleFormData, value: string) => {
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
  data: SampleFormData;
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

      <div className="result-grid">
        {blocks.map((block) => (
          <article className="result-card" key={block.title}>
            <div className="result-card-header">
              <h2>{block.title}</h2>
              <button className="copy-button" onClick={() => onCopy(block)}>
                {copiedBlock === block.title ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <p>{block.content}</p>
          </article>
        ))}
      </div>

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

function PlansPage() {
  const plans = [
    {
      name: 'Kit Express',
      price: 'R$27',
      description: 'Ideal para validar uma oferta com peças essenciais.',
      features: ['Diagnóstico objetivo', 'Headline e CTA', 'Mensagem curta de venda'],
      link: planLinks.express,
    },
    {
      name: 'Kit Venda Completo',
      price: 'R$47',
      description: 'O pacote principal para lançar ou melhorar sua comunicação.',
      features: ['Roteiros de conteúdo', 'WhatsApp persuasivo', 'Ângulos e objeções'],
      link: planLinks.complete,
      featured: true,
    },
    {
      name: 'Conteúdo 30 Dias',
      price: 'R$97',
      description: 'Planejamento de posts para manter constância comercial.',
      features: ['Calendário mensal', 'Ideias por funil', 'Chamadas diárias para ação'],
      link: planLinks.days,
    },
  ];

  return (
    <section className="plans-section">
      <div className="section-heading">
        <span className="eyebrow">Planos</span>
        <h1>Escolha o pacote para acelerar suas vendas</h1>
        <p>Links de compra são placeholders da Kiwify enquanto o MVP é validado.</p>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <article className={`plan-card ${plan.featured ? 'featured-plan' : ''}`} key={plan.name}>
            {plan.featured && <span className="badge">Mais escolhido</span>}
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <strong>{plan.price}</strong>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a className="primary-button plan-button" href={plan.link} target="_blank" rel="noreferrer">
              Comprar agora
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function generateSample(data: SampleFormData): ResultBlock[] {
  const product = cleanInput(data.produto, 'sua oferta');
  const audience = cleanInput(data.publico, 'quem precisa vender melhor');
  const pain = cleanInput(data.dor, 'não conseguir transformar interesse em compra');
  const benefit = cleanInput(data.beneficio, 'ter uma solução mais simples e confiável');
  const channel = cleanInput(data.canal, 'seu principal canal');
  const tone = data.tom.toLowerCase();
  const audienceLabel = makeAudienceLabel(audience);
  const painContext = makePainContext(pain);
  const benefitOutcome = makeBenefitOutcome(benefit);
  const channelCue = makeChannelCue(channel);

  return [
    {
      title: '1. Diagnóstico rápido da oferta',
      content: `${product} tem potencial porque resolve uma tensão clara: existe alguém tentando avançar, mas preso em ${painContext}. A comunicação deve vender menos “características” e mostrar mais a mudança prática que acontece depois da compra. O ponto mais forte da oferta é aproximar o desejo de ${audienceLabel} de um resultado percebido como rápido, seguro e possível: ${benefitOutcome}.`,
    },
    {
      title: '2. Melhor ângulo de venda',
      content: `O melhor caminho é posicionar ${product} como o atalho para sair do improviso e tomar uma decisão com mais confiança. Em vez de insistir no problema o tempo todo, use um ângulo de “clareza + próximo passo”: mostre o custo de continuar parado, apresente a solução como simples de começar e prove que a transformação não depende de sorte. Esse ângulo combina bem com um tom ${tone} em ${channelCue}.`,
    },
    {
      title: '3. Roteiro de Reels',
      content: `Gancho: “Você não precisa de mais tentativa e erro para resolver isso.” Problema: mostre a rotina de quem tenta melhorar, mas continua travado por falta de direção. Consequência: destaque que adiar a decisão custa tempo, energia e oportunidades. Solução: apresente ${product} como um caminho prático para organizar a próxima ação e chegar em ${benefitOutcome}. CTA: “Se você quer uma versão pronta para aplicar, me chame com a palavra VENDAS.”`,
    },
    {
      title: '4. Mensagem de WhatsApp',
      content: `Oi! Tudo bem? Vi seu interesse e acho que ${product} pode fazer sentido para o seu momento. A ideia é te ajudar a sair do excesso de tentativa e ir direto para uma abordagem mais clara, com foco em resultado. Se quiser, eu te explico em poucas mensagens como funciona e te digo qual opção combina melhor com o que você precisa agora.`,
    },
    {
      title: '5. Headline de venda',
      content: `${product}: venda com mais clareza e menos improviso.`,
    },
    {
      title: '6. CTA para comprar o pacote completo',
      content: `Gostou da amostra? No pacote completo, você recebe uma versão muito mais estratégica: ângulos de venda, textos prontos, variações por canal e chamadas para ação pensadas para transformar interesse em compra. Escolha um plano e leve um kit comercial pronto para usar, sem depender de tela em branco.`,
    },
  ];
}

function cleanInput(value: string, fallback: string) {
  return value.trim().replace(/\s+/g, ' ') || fallback;
}

function makeAudienceLabel(audience: string) {
  const normalized = audience.toLowerCase();

  if (normalized.startsWith('pessoas') || normalized.startsWith('quem')) {
    return normalized;
  }

  return `esse público (${audience})`;
}

function makePainContext(pain: string) {
  const normalized = pain.toLowerCase();

  if (normalized.startsWith('falta') || normalized.startsWith('medo') || normalized.startsWith('dificuldade')) {
    return normalized;
  }

  return `um cenário de ${normalized}`;
}

function makeBenefitOutcome(benefit: string) {
  const normalized = benefit.toLowerCase();

  if (normalized.startsWith('ter ') || normalized.startsWith('conseguir ') || normalized.startsWith('aumentar ')) {
    return normalized;
  }

  return `alcançar ${normalized}`;
}

function makeChannelCue(channel: string) {
  const normalized = channel.toLowerCase();

  if (normalized.includes('whatsapp')) {
    return 'uma conversa de WhatsApp, onde proximidade e objetividade fazem diferença';
  }

  if (normalized.includes('reels') || normalized.includes('instagram')) {
    return 'conteúdos curtos, com gancho forte e leitura rápida';
  }

  if (normalized.includes('anún')) {
    return 'anúncios diretos, com promessa simples e CTA evidente';
  }

  if (normalized.includes('página')) {
    return 'uma página de venda, onde prova e clareza precisam conduzir a decisão';
  }

  return channel;
}

export default App;
