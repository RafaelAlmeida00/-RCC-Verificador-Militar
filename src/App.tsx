import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { ClipLoader } from "react-spinners";

interface Ig {
  rcc: boolean,
    dezessete: boolean,
    cod: "" | boolean,
    cog: "" | boolean,
    cp: "" | boolean,
    asp: "" | boolean,
    executivo: "" | boolean,
}

function App() {
  const [nick, setNick] = useState("");
  const [figureString, setFigureString] = useState("");
  const [user, setUser] = useState<any>();
  const [missao, setMissao] = useState("");
  const [cp] = useState("g-hhbr-46071591186b5c06d98d404fa2e2a5d9");
  const [rcc] = useState("g-hhbr-3ce4d08a04412a40fb64ec489c8dbe62");
  const [cog] = useState("g-hhbr-07017942256808f9203346ca0c533d10");
  const [cod] = useState("g-hhbr-3a02fa08ff3d9734910acf9537dfff5d");
  const [asp] = useState("g-hhbr-a6d51766f832f02bba05fe0c87bd69ba");
  const [executivo] = useState("g-hhbr-e0da4d77385e49b909098a76a2fb004a");
  const [dezessete] = useState("g-hhbr-3ce4d08a04412a40fb64ec489c8dbe62");
  const [tipoHierarquia, setTipoHierarquia] = useState<Array<string>>();
  const [missaook, setMissaook] = useState(false);
  const [perfil, setPerfil] = useState<boolean>();
  const [acesso, setAcesso] = useState<string>();
  const [diasoff, setDiasoff] = useState<number>(0);
  const [grupos, setGrupos] = useState<Ig>({
    rcc: false,
    dezessete: false,
    cod: "",
    cog: "",
    cp: "",
    asp: "",
    executivo: "",
  });
  const [loading, setLoading] = useState<boolean>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth <= 980) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Checa a cada vez que a tela é redimensionada
    window.addEventListener("resize", checkDevice);

    // Verifica o dispositivo inicialmente
    checkDevice();

    // Limpeza do event listener
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  useEffect(() => {
    verificarMissao();
  }, [missao]);

  const hierarquia = {
    militar: {
      cp: [
        { masculino: "Soldado", feminino: "Soldado" },
        { masculino: "Cabo", feminino: "Cabo" },
        { masculino: "Sargento", feminino: "Sargento" },
        { masculino: "Subtenente", feminino: "Subtenente" },
      ],
      asp: [
        { masculino: "Aspirante a Oficial", feminino: "Aspirante a Oficial" },
      ],
      cod: [
        { masculino: "Tenente", feminino: "Tenente" },
        { masculino: "Capitão", feminino: "Capitã" },
        { masculino: "Coronel", feminino: "Coronel" },
      ],
      cog: [
        { masculino: "General", feminino: "General" },
        { masculino: "Marechal", feminino: "Marechal" },
        { masculino: "Comandante", feminino: "Comandante" },
        { masculino: "Comandante-Geral", feminino: "Comandante-Geral" },
      ],
    },
    executivo: {
      cp: [
        { masculino: "Trainee", feminino: "Trainee" },
        { masculino: "Assessor", feminino: "Assessora" },
        { masculino: "Secretário", feminino: "Secretária" },
        { masculino: "Secretário-Chefe", feminino: "Secretária-Chefe" },
        { masculino: "Assistente", feminino: "Assistente" },
        { masculino: "Assistente-Chefe", feminino: "Assistente-Chefe" },
      ],
      asp: [
        { masculino: "Analista", feminino: "Analista" },
        { masculino: "Analista-Chefe", feminino: "Analista-Chefe" },
      ],
      cod: [
        { masculino: "Supervisor", feminino: "Supervisora" },
        { masculino: "Supervisor-Geral", feminino: "Supervisora-Geral" },
        { masculino: "Inspetor", feminino: "Inspetora" },
        { masculino: "Inspetor-Geral", feminino: "Inspetora-Geral" },
        { masculino: "Coordenador", feminino: "Coordenadora" },
        { masculino: "Coordenador-Geral", feminino: "Coordenadora-Geral" },
      ],
      cog: [
        { masculino: "Superintendente", feminino: "Superintendente" },
        {
          masculino: "Superintendente-Geral",
          feminino: "Superintendente-Geral",
        },
        { masculino: "VIP", feminino: "VIP" },
        { masculino: "Vice-Presidente", feminino: "Vice-Presidente" },
        { masculino: "Presidente", feminino: "Presidente" },
        {
          masculino: "Acionista Majoritário",
          feminino: "Acionista Majoritária",
        },
        { masculino: "Chanceler", feminino: "Chanceler" },
      ],
    },
  };

  const verificarMissao = () => {
    if (!missao.startsWith("[RCC]")) {
      setMissaook(false); // Reseta o estado
      setTipoHierarquia([]); // Reseta o estado da hierarquia
      return; // Encerra a função
    }

    const tagMatch = missao.match(/\[([A-Z0-9]{3})\]/);
    if (!tagMatch) {
      setMissaook(false); // Reseta o estado
      setTipoHierarquia([]); // Reseta o estado da hierarquia
      return; // Encerra a função
    }

    let encontrado = false;

    Object.entries(hierarquia).forEach(([tipo, niveis]) => {
      Object.entries(niveis).forEach(([nivel, cargos]) => {
        if (
          cargos.some(
            (cargo) =>
              missao.includes(cargo.masculino) ||
              missao.includes(cargo.feminino)
          )
        ) {
          encontrado = true;
          setMissaook(encontrado);

          // Definições específicas conforme o cargo encontrado
          if (nivel === "cog") {
            if (tipo === "executivo") {
              setTipoHierarquia([tipo, "cod"]);
            } else {
              setTipoHierarquia([tipo, "cod", "cog"]);
            }
          } else if (nivel === "asp") {
            setTipoHierarquia([tipo, "asp"]);
          } else if (nivel === "cod") {
            setTipoHierarquia([tipo, "cod"]);
          } else if (nivel === "cp") {
            setTipoHierarquia([tipo, "cp"]);
          } else {
            setTipoHierarquia([tipo, nivel]);
          }
        }
      });
    });

    if (!encontrado) {
      setMissaook(encontrado);
      alert("Cargo não encontrado na hierarquia!");
      setTipoHierarquia([]); // Reseta o estado se não for encontrado
      return; // Encerra a função
    }

    // Define os grupos obrigatórios
    const obrigatorios = [rcc, dezessete];

    // Inicializa o objeto de grupos com "Não necessário" como valor padrão
    const gruposVerificados: any = {
      rcc: false,
      dezessete: false,
      cod: "Não necessário",
      cog: "Não necessário",
      cp: "Não necessário",
      asp: "Não necessário",
      executivo: "Não necessário",
    };

    // Determina os grupos necessários com base na hierarquia atual
    const hierarquiaAtual = tipoHierarquia || [];
    const gruposNecessarios = new Set(obrigatorios); // Sempre incluir os obrigatórios

    if (hierarquiaAtual.includes("cod")) {
      gruposNecessarios.add(cod);
      gruposVerificados.cod = false; // Marcado como necessário
    }
    if (hierarquiaAtual.includes("cog")) {
      gruposNecessarios.add(cog);
      gruposVerificados.cog = false; // Marcado como necessário
    }
    if (hierarquiaAtual.includes("cp")) {
      gruposNecessarios.add(cp);
      gruposVerificados.cp = false; // Marcado como necessário
    }
    if (hierarquiaAtual.includes("asp")) {
      gruposNecessarios.add(asp);
      gruposVerificados.asp = false; // Marcado como necessário
    }
    if (hierarquiaAtual.includes("executivo")) {
      gruposNecessarios.add(executivo);
      gruposVerificados.executivo = false; // Marcado como necessário
    }

    // Verifica os grupos do usuário
    user.groups.forEach((group: any) => {
      if (group.id === rcc) gruposVerificados.rcc = true;
      if (group.id === dezessete) gruposVerificados.dezessete = true;
      if (group.id === cod) gruposVerificados.cod = true;
      if (group.id === cog) gruposVerificados.cog = true;
      if (group.id === cp) gruposVerificados.cp = true;
      if (group.id === asp) gruposVerificados.asp = true;
      if (group.id === executivo) gruposVerificados.executivo = true;
    });

    setGrupos(gruposVerificados);
    setLoading(false);
  };

  const handleVerification = async () => {
    setTipoHierarquia([]);
    const user: any = await axios.get(
      `https://www.habbo.com.br/api/public/users?name=${nick}`
    );
    console.log(`https://www.habbo.com.br/api/public/users?name=${nick}`, user);
    const profile: any = await axios.get(
      `https://www.habbo.com.br/api/public/users/${user.data.uniqueId}/profile`
    );
    if (figureString !== user.data.figureString) {
      setLoading(true);
      //limpar grupos
      setGrupos({
        rcc: false,
        dezessete: false,
        cod: "",
        cog: "",
        cp: "",
        asp: "",
        executivo: "",
      });
    }
    setUser(profile.data);
    setMissao(user.data.motto);
    setFigureString(user.data.figureString);

    // Converte a data para o formato dd/mm/yyyy
    const accessDate: any = new Date(user.data.lastAccessTime);
    const formattedDate = `${accessDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(accessDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${accessDate.getFullYear()}`;
    setAcesso(formattedDate); // Salva a data formatada como string

    setPerfil(user.data.profileVisible);

    const now: any = new Date();

    // Calcula a diferença em milissegundos e converte para dias completos
    const diffInMilliseconds = now - accessDate;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    setDiasoff(diffInDays);
  };

  console.log(nick, figureString, user, tipoHierarquia);

  return (
    <>
      <section
        style={{
          alignSelf: "center",
          height: isMobile ? "200vh" : "100vh",
          width: isMobile ? "100%" : "100vw",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row", // Muda o layout baseado no dispositivo
          gap: 30,
        }}
      >
        <section
          style={{
            backgroundColor: "rgb(44, 44, 44)",
            alignSelf: "center",
            height: "95vh",
            width: isMobile ? "90%" : "30vw",
            borderRadius: 20,
          }}
        >
          <div
            style={{
              marginTop: 40,
              alignSelf: "center",
              height: "10vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              alignContent: "stretch",
            }}
          >
            <select
              id="verificar-opcao"
              name="verificar-opcao"
              style={{
                textAlign: "center",
                width: "50%",
                backgroundColor: "rgb(99, 99, 99)",
                borderRadius: 20,
                padding: 10,
                fontWeight: "bold",
              }}
              value={0} // Aqui o valor do select deve ser o estado `count`
            >
              <option value="0">Verificar Militar</option>
            </select>
          </div>
          <div
            style={{
              alignSelf: "center",
              height: "7vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              alignContent: "stretch",
            }}
          >
            <input
              style={{
                textAlign: "center",
                width: "50%",
                backgroundColor: "rgb(99, 99, 99)",
                borderRadius: 20,
                padding: 10,
                fontWeight: "bold",
                color: "white",
              }}
              type="text"
              name="nick"
              id="nick"
              placeholder="Nickname"
              value={nick}
              onChange={(e) => {
                setNick(e.target.value);
              }}
            />
          </div>
          <div
            style={{
              alignSelf: "center",
              height: "7vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              alignContent: "stretch",
              marginTop: 10,
            }}
          >
            <button
              style={{
                textAlign: "center",
                width: "50%",
                backgroundColor: "rgb(99, 99, 99)",
                borderRadius: 20,
                padding: 10,
                fontWeight: "bold",
                color: "white",
              }}
              name="nick"
              id="nick"
              value={nick}
              onClick={() => {
                handleVerification();
              }}
            >
              Pesquisar
            </button>
          </div>
          <div
            style={{
              alignSelf: "center",
              height: "50vh",
              width: "100%",
            }}
          >
            <img
              src={`https://sandbox.habbo.com/habbo-imaging/avatarimage?figure=${figureString}&gender=M&size=l&direction=2&head_direction=3`}
            ></img>
          </div>
          <div
            style={{
              alignSelf: "center",
              height: "auto",
              width: "100%",
              textAlign: "center",
            }}
          >
            <p
              style={{
                width: "70%",
                margin: "0 auto",
              }}
            >
              {" "}
              {missao} - {missaook ? "✅ Ok" : "❌ Missão errada"}
            </p>
          </div>
          <div></div>
        </section>
        <section
          style={{
            backgroundColor: "rgb(44, 44, 44)",
            alignSelf: "center",
            height: "95vh",
            width: isMobile ? "90%" : "30vw",
            borderRadius: 20,
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  alignSelf: "center",
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                <ClipLoader color="#3498db" loading={loading} size={50} />
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                  marginTop: 40,
                }}
              >
                Perfil Visível? - {perfil ? "✅ Visível" : "❌ Não Vísivel"}
              </div>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                Último Acesso? - {acesso ? String(acesso) : ""} -{" "}
                {String(diasoff)} dias Offline{" "}
              </div>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                Grupo Oficial da RCC? - {grupos.rcc ? "✅ OK" : "❌ Não Possui"}
              </div>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                Grupo Oficial de 17 anos RCC? -{" "}
                {grupos.dezessete ? "✅ OK" : "❌ Não Possui"}
              </div>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                Grupo de Praças da RCC? -{" "}
                {grupos.cp == true
                  ? "✅ OK"
                  : grupos.cp == false
                  ? "❌ Não Possui"
                  : grupos.cp}
              </div>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                Grupo de Aspirantes da RCC? -{" "}
                {grupos.asp == true
                  ? "✅ OK"
                  : grupos.asp == false
                  ? "❌ Não Possui"
                  : grupos.asp}
              </div>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                Grupo de Executivos da RCC? -{" "}
                {grupos.executivo == true
                  ? "✅ OK"
                  : grupos.executivo == false
                  ? "❌ Não Possui"
                  : grupos.executivo}
              </div>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                Grupo do Corpo de Oficiais da RCC? -{" "}
                {grupos.cod == true
                  ? "✅ OK"
                  : grupos.cod == false
                  ? "❌ Não Possui"
                  : grupos.cod}
              </div>
              <div
                style={{
                  alignSelf: "center",
                  height: "7vh",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "stretch",
                }}
              >
                Grupo do Corpo de Oficiais Generais da RCC? -{" "}
                {grupos.cog == true
                  ? "✅ OK"
                  : grupos.cog == false
                  ? "❌ Não Possui"
                  : grupos.cog}
              </div>
            </>
          )}
        </section>
      </section>
    </>
  );
}

export default App;
