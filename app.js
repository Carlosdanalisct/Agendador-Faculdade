/* ==========================================================
   app.js  |  Portal do Aluno (React 18 via CDN, sem build)
   Usa React.createElement (h) em vez de JSX.
   - Login ......... nome + CPF (validado) + senha. Só o nome é salvo
                     (localStorage 'pda_nome'). CPF e senha NÃO são guardados.
   - Portal ........ topbar, menu lateral, cards, banner
   - Agendamento ... link para agendamento/index.html (mesma aba)
   ========================================================== */
const { useState } = React;
const h = React.createElement;

/* ícones (traços simples) */
const P = {
  home:"M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
  book:"M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z",
  dollar:"M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  list:"M3 4h18v16H3zM7 9h10M7 13h10M7 17h6",
  clip:"M8 4h8v3H8zM6 5H4v16h16V5h-2M8 12h8M8 16h5",
  play:"M3 4h18v13H3zM10 8l5 3-5 3zM8 21h8",
  cal:"M4 5h16v16H4zM4 10h16M9 3v4M15 3v4M8 14h2M12 14h2M16 14h0M8 18h2M12 18h2",
  bell:"M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
  mega:"M3 10v4h4l8 5V5L7 10zM19 8l2-1M19 12h3M19 16l2 1",
  gear:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-2-4-2 1-2-1-1-2h-4l-1 2-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1z",
  phone:"M5 3h4l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z",
  search:"M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5",
  clock:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  bm:"M6 3h12v18l-6-4-6 4z",
  head:"M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3zM17 19c0 1.5-2 2-5 2",
  doc:"M5 3h11l3 3v15H5zM9 11h6M9 15h6M9 7h3",
  star:"M3 6h18v12H3zM12 8l1.2 2.5 2.8.4-2 2 .5 2.8L12 14.3 9.5 15.7l.5-2.8-2-2 2.8-.4z",
  user:"M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM4 21c0-4 3-6 8-6M15 18l2 2 4-4",
  chev:"M9 5l7 7-7 7",
  left:"M15 5l-7 7 7 7",
  right:"M9 5l7 7-7 7",
  ext:"M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"
};
const Icon = (n, cls) => h("svg", {className:"i "+(cls||""), viewBox:"0 0 24 24", "aria-hidden":true},
  h("path", {d:P[n]}));

/* Topo */
function Topbar({onLogout}){
  return h("header", {className:"top"},
    h("div", {className:"logo"},
      h("svg", {width:38, height:38, viewBox:"0 0 38 38"},
        h("path", {d:"M19 4L35 33H3z", fill:"#f26a1b"}),
        h("path", {d:"M19 14l9 16H10z", fill:"#fff"})),
      h("div", null, "Portal", h("small", null, "do Aluno"))),
    h("label", {className:"search"}, Icon("search"),
      h("input", {placeholder:"Procure por artigos, solicitações ou serviços.", "aria-label":"Buscar"})),
    h("div", {className:"tools"},
      h("button", {className:"ib", "aria-label":"Comunicados"}, Icon("mega")),
      h("button", {className:"ib", "aria-label":"Notificações"}, Icon("bell"), h("span", {className:"badge"}, "2")),
      h("button", {className:"ib", "aria-label":"Configurações"}, Icon("gear")),
      h("span", {className:"sep"}),
      h("button", {className:"ib call", "aria-label":"Atendimento"}, Icon("phone")),
      h("span", {className:"sep"}),
      h("button", {className:"ib sair", onClick:onLogout}, "Sair"),
      h("button", {className:"ib", "aria-label":"Perfil"}, h("span", {className:"avatar"}))));
}

/* Menu lateral */
function Sidebar({active, onSelect}){
  const items = [
    ["Início","home"],["Meu Curso","book"],["Financeiro","dollar"],
    ["Secretaria","list"],["Minhas Solicitações","clip"]
  ];
  const Btn = (label, icon, ext) => h("button", {
      key:label, className:"nav"+(active===label?" active":""), onClick:()=>onSelect(label)},
      Icon(icon), label, ext && Icon("ext","ext"));
  return h("aside", {className:"side"},
    h("nav", null,
      items.map(([l,i]) => Btn(l,i)),
      h("div", {className:"divider"}),
      Btn("Estudar","play",true),
      h("a", {className:"nav", href:"agendamento/index.html", target:"_self"},
        Icon("cal"), "Agendamento")));
}

/* Cards */
const Quick = ({icon,title,sub,onClick,href,hl}) =>
  h(href ? "a" : "button", {className:"card row"+(hl?" hl":""), onClick, href},
    h("span", {className:"ico"}, Icon(icon)),
    h("div", null, h("div", {className:"t"}, title), h("div", {className:"s"}, sub)));

const Task = ({icon,title,sub,bar}) =>
  h("button", {className:"card task"+(bar?"":" plain")},
    h("span", {className:"ico"}, Icon(icon)),
    h("div", {className:"body"},
      h("div", {className:"t"}, title), h("div", {className:"s"}, sub),
      bar && h("div", {className:"bar"})),
    Icon("chev","chev"));

/* Banner */
function Banner(){
  const [paused, setPaused] = useState(false);
  const [slide, setSlide] = useState(0);
  const go = d => setSlide((slide + d + 3) % 3);
  return h("div", {className:"banner", role:"region", "aria-label":"Destaques"},
    h("h3", null, "O seu Modelo Avaliativo mudou!"),
    h("p", null, "Pensando em transformar a sua experiência de aprendizado e te preparar para os desafios reais, atualizamos o modelo de avaliação."),
    h("div", {className:"pill"}, "Confira os detalhes no seu Manual Avaliativo"),
    h("button", {className:"nb l", "aria-label":"Anterior", onClick:()=>go(-1)}, Icon("left")),
    h("button", {className:"nb r", "aria-label":"Próximo", onClick:()=>go(1)}, Icon("right")),
    h("div", {className:"dots"}, [0,1,2].map(i => h("i", {key:i, className:i===slide?"on":""}))),
    h("button", {className:"pause", "aria-label":paused?"Reproduzir":"Pausar", onClick:()=>setPaused(!paused)},
      paused
        ? h("svg", {width:12, height:12, viewBox:"0 0 12 12"}, h("path", {d:"M2 1l9 5-9 5z", fill:"currentColor"}))
        : h("svg", {width:12, height:12, viewBox:"0 0 12 12"}, h("path", {d:"M2 1h3v10H2zM7 1h3v10H7z", fill:"currentColor"}))));
}

/* Página */
function Portal({user, onLogout}){
  const [active, setActive] = useState("Início");
  const [toast, setToast] = useState("");
  const select = l => { setActive(l); if(l==="Agendamento") setToast("Agendamento aberto"); else setToast(""); };

  return h(React.Fragment, null,
    h(Topbar, {onLogout}),
    h("div", {className:"shell"},
      h(Sidebar, {active, onSelect:select}),
      h("main", null,
        h("section", {className:"hero"},
          h("h1", null, "Olá, " + user),
          h("p", null, "Boas vindas ao nosso Portal do Aluno! Aqui, você encontra as ferramentas necessárias para acompanhar sua trajetória acadêmica.")),
        h("div", {className:"content"},
          toast && h("div", {className:"card row", role:"status", style:{height:56,marginBottom:16,color:"var(--blue)"}},
            Icon("cal"), toast),
          h("div", {className:"card row alert"},
            h("span", {className:"ico"}, Icon("clock")),
            h("div", null,
              h("div", {className:"t"}, "Ajuste de Horário"),
              h("div", {className:"s"}, "Sua Grade de Horário já está confirmada para este semestre."))),
          h("h2", null, "Acesso rápido"),
          h("div", {className:"quick"},
            h(Quick, {icon:"cal", title:"Agendar atendimento", sub:"Marque horário com a coordenação do seu curso", href:"agendamento/index.html", hl:true}),
            h(Quick, {icon:"clock", title:"Quadro de Horários", sub:"Acompanhe o horário das suas aulas"}),
            h(Quick, {icon:"bm", title:"Disciplinas e Notas", sub:"Acompanhe suas disciplinas e notas"}),
            h(Quick, {icon:"play", title:"Estudar", sub:"Acesse seu AVA"}),
            h(Quick, {icon:"head", title:"Dúvidas e Orientações", sub:"Acessar base de conhecimento"})),
          h("h2", null, "Tarefas importantes"),
          h("div", {className:"tasks"},
            h("div", {className:"list"},
              h(Task, {icon:"doc", title:"Entregar documentos", sub:"Parabéns você entregou todos os documentos", bar:true}),
              h(Task, {icon:"star", title:"Atividades complementares", sub:"Parabéns você entregou todas as atividades complementares", bar:true}),
              h(Task, {icon:"user", title:"Atualização cadastral", sub:"Mantenha seus dados atualizados"})),
            h(Banner)))))
  );
}

/* Login */
P.eye = "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z";
P.eyeoff = "M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.5 6.6A17 17 0 0 0 2 12s4 7 10 7a9.6 9.6 0 0 0 4-.9M9.9 9.9a3 3 0 0 0 4.2 4.2";

function validCpf(v){
  const d = v.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  for (let t = 9; t < 11; t++) {
    let s = 0;
    for (let i = 0; i < t; i++) s += d[i] * (t + 1 - i);
    if (((s * 10) % 11) % 10 != d[t]) return false;
  }
  return true;
}
const maskCpf = v => v.replace(/\D/g, "").slice(0, 11)
  .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");

function Login({ onEnter }){
  const [nome, setNome] = useState(""), [cpf, setCpf] = useState(""), [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false), [err, setErr] = useState({}), [info, setInfo] = useState("");

  const submit = e => {
    e.preventDefault();
    const n = nome.trim().replace(/\s+/g, " "), x = {};
    if (n.length < 2) x.nome = "Informe como podemos chamar você.";
    if (!validCpf(cpf)) x.cpf = "Informe um CPF válido, com 11 números.";
    if (senha.length < 6) x.senha = "A senha deve ter pelo menos 6 caracteres.";
    setErr(x);
    if (Object.keys(x).length) return;
    onEnter(n); /* CPF e senha não são guardados */
  };

  const field = (id, label, props, extra) => h("div", { className: "fld" },
    h("label", { htmlFor: id }, label),
    h("div", { className: "inp" + (err[id] ? " bad" : "") },
      h("input", Object.assign({ id, "aria-invalid": !!err[id], "aria-describedby": err[id] ? id + "-e" : undefined }, props)),
      extra),
    err[id] && h("p", { className: "err", id: id + "-e", role: "alert" }, err[id]));

  return h("div", { className: "login" },
    h("main", { className: "login-form" },
      h("div", { className: "brand" },
        h("svg", { width: 38, height: 38, viewBox: "0 0 38 38", "aria-hidden": true },
          h("path", { d: "M19 4L35 33H3z", fill: "#f26a1b" }), h("path", { d: "M19 14l9 16H10z", fill: "#fff" })),
        h("div", null, "Portal", h("br"), "do Aluno")),
      h("h1", null, "Bem-vindo!"),
      h("p", { className: "lead" }, "Que bom ter você aqui. Acesse o Portal do Aluno para continuar."),
      h("form", { onSubmit: submit, noValidate: true },
        field("nome", "Nome", { type: "text", value: nome, maxLength: 40, autoComplete: "name", placeholder: "Como você quer ser chamado(a)", onChange: e => setNome(e.target.value) }),
        field("cpf", "CPF", { type: "text", inputMode: "numeric", value: cpf, autoComplete: "off", placeholder: "000.000.000-00", onChange: e => setCpf(maskCpf(e.target.value)) }),
        field("senha", "Senha", { type: ver ? "text" : "password", value: senha, autoComplete: "current-password", onChange: e => setSenha(e.target.value) },
          h("button", { type: "button", className: "eye", "aria-pressed": ver, "aria-label": ver ? "Ocultar senha" : "Mostrar senha", onClick: () => setVer(!ver) }, Icon(ver ? "eyeoff" : "eye"))),
        h("button", { type: "button", className: "link", onClick: () => setInfo("Recuperação de senha fora do escopo desta demonstração.") }, "Esqueci minha senha"),
        info && h("p", { className: "mu-note", role: "status" }, info),
        h("button", { type: "submit", className: "go" }, "Entrar")),
      h("footer", { className: "login-foot" },
        h("p", null, "Demonstração: nenhum dado é enviado. Apenas o nome fica salvo neste navegador, para saudar você. CPF e senha não são guardados."),
        h("p", null, "Versão de demonstração"))),
    h("aside", { className: "login-art", "aria-hidden": true },
      h("svg", { viewBox: "0 0 320 240", width: "100%", style: { maxWidth: 420 } },
        h("rect", { x: 40, y: 150, width: 200, height: 22, rx: 4, fill: "#fff", opacity: .95 }),
        h("rect", { x: 56, y: 126, width: 170, height: 22, rx: 4, fill: "#ffd7bd" }),
        h("rect", { x: 70, y: 102, width: 150, height: 22, rx: 4, fill: "#f26a1b" }),
        h("rect", { x: 190, y: 36, width: 90, height: 84, rx: 10, fill: "#fff" }),
        h("rect", { x: 190, y: 36, width: 90, height: 22, rx: 10, fill: "#f26a1b" }),
        [0, 1, 2, 3, 4, 5].map(i => h("circle", { key: i, cx: 208 + (i % 3) * 22, cy: 78 + Math.floor(i / 3) * 22, r: 5, fill: i === 4 ? "#0a4fd6" : "#c9d6ee" }))),
      h("p", null, "Estude, acompanhe e agende atendimentos em um só lugar.")));
}

function App(){
  const [user, setUser] = useState(() => { try { return localStorage.getItem("pda_nome") || ""; } catch (e) { return ""; } });
  const enter = n => { try { localStorage.setItem("pda_nome", n); } catch (e) {} setUser(n); };
  const leave = () => { try { localStorage.removeItem("pda_nome"); } catch (e) {} setUser(""); };
  return user ? h(Portal, { user, onLogout: leave }) : h(Login, { onEnter: enter });
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
