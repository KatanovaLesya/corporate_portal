import { useEffect } from "react";
import style from "../pages/Home.module.css";

const NoAccess = () => {
  useEffect(() => {
    console.warn("❌ Користувач не має доступу. Потрібно звернутися до адміністратора.");
  }, []);

  return (
    <div className={style.container}>
      <h1 className={style.title}>Доступ обмежено</h1>
      <p className="text-lg mt-2">
        Ви ще не маєте доступу до корпоративного порталу. <br /> Будь ласка, зверніться до адміністратора.
      </p>

      {/* Блок з контактами адміністраторів */}
      <div className="flex flex-col items-center mt-4 space-y-3">
        <a
          href="https://t.me/Dmytro_Kalinin_Solvensy"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Контактуватися з Дмитром Каліниним
        </a>

        <a
          href="https://t.me/Chernega_Katerina_Solvensy"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Контактуватися з Катериною Чернегою
        </a>

        <a
          href="https://t.me/Katanova_Lesya_Solvensy"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Контактуватися з Лесею Катановою
        </a>
      </div>
    </div>
  );
};

export default NoAccess;
