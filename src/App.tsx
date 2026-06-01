import { FormEvent, useMemo, useState } from 'react';

type Page = 'home' | 'sample' | 'result' | 'plans';

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
  express: 'https://pay.kiwify.com.br/kit-express-placeholder',
  complete: 'https://pay.kiwify.com.br/kit-venda-completo-placeholder',
  days: 'https://pay.kiwify.com.br/conteudo-30-dias-placeholder',
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
        content: `Gancho: Você sabe quanto realmente sobra da sua safra depois de pagar tudo?

Problema: Muitos produtores olham só para o valor da venda e acham que tiveram lucro.

Consequência: Mas quando entram insumos, diesel, diárias, manutenção, máquinas e pequenos gastos, a conta muda.

Solução: ${produto} organiza os custos e mostra o lucro real da produção, com mais clareza sobre ${beneficio}.

CTA: Quer enxergar sua safra com mais clareza? Chame no WhatsApp.`,
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
      content: `Gancho: ${publico} ainda perde vendas, energia ou previsibilidade por causa de ${dor}?

Problema: Quando esse problema vira rotina, a pessoa tenta compensar no esforço e continua sem chegar em ${beneficio}.

Consequência: O resultado é uma oferta mais difícil de explicar, uma decisão mais lenta e clientes sem perceberem o valor real do que está sendo vendido.

Solução: ${produto} organiza a mensagem da oferta e mostra por que ${beneficio} é o próximo passo mais lógico.

CTA: Quer ver como isso se aplica ao seu caso? Chame no WhatsApp.`,
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
