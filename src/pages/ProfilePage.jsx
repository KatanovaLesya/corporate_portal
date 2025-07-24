import { useEffect, useState, useRef } from "react";
import { getCurrentUser, patchProfile, uploadAvatar } from "../services/authService";
import styles from "./ProfilePage.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { IoSave } from "react-icons/io5";


const PencilIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="gray" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-9.193 9.193a1 1 0 0 1-.293.207l-3 1.5a1 1 0 0 1-1.316-1.316l1.5-3a1 1 0 0 1 .207-.293l9.193-9.193zm2.121-2.121a4 4 0 0 0-5.656 0L3.879 7.636A3 3 0 0 0 3 9.758l-1.5 3A3 3 0 0 0 6.242 18.5l3-1.5a3 3 0 0 0 2.122-.879l6.172-6.172a4 4 0 0 0 0-5.656z"/>
  </svg>
);
PencilIcon.propTypes = {
  size: PropTypes.number,
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editTelegram, setEditTelegram] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);

  const [telegram, setTelegram] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setTelegram(currentUser?.telegram || "");
      setPhone(currentUser?.phone || "");
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setEditAvatar(true);
    }
  };

  const saveTelegram = async () => {
    const updatedUser = await patchProfile({ telegram });
    setUser(updatedUser);
    setEditTelegram(false);
  };

  const savePhone = async () => {
    const updatedUser = await patchProfile({ phone });
    setUser(updatedUser);
    setEditPhone(false);
  };

  const saveAvatar = async () => {
    if (avatarFile) {
      await uploadAvatar(avatarFile);
      // оновити user, бо PATCH avatar повертає лише url:
      const freshUser = await getCurrentUser();
      setUser(freshUser);
      setEditAvatar(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  };

  if (loading) return <div>Завантаження...</div>;
  if (!user) return <div>Профіль не знайдено</div>;

  return (
    <div className={styles["profile-outer-col"]}>
      <div className={styles["profile-page"]}>
        <h2>PROFILE</h2>

        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={avatarPreview || user.avatarURL || "/default-avatar.png"} alt={user.name} className={styles["profile-avatar"]}/>
          <button type="button" className={styles["avatar-edit-btn"]} onClick={() => fileInputRef.current?.click()} title="Змінити аватар">
            <PencilIcon size={18} />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleAvatarChange}/>
          {editAvatar && (
            <div style={{ marginTop: 8, textAlign: "center" }}>
              <button onClick={saveAvatar} className={styles["profile-save-btn"]} title="Зберегти">
                <IoSave size={22} />
              </button>
              <button
                onClick={() => {
                  setEditAvatar(false);
                  setAvatarPreview(null);
                  setAvatarFile(null);
                }}
                className={styles["profile-cancel-btn"]}
                title="Скасувати"
              >
                <MdCancel size={22}/>
              </button>
            </div>
          )}
        </div>

        <div className={styles["profile-fields-list"]}>
          <div className={styles["profile-field-row"]}>
            <span className={styles["profile-label"]}>Імʼя:</span>
            <span className={styles["profile-field-value"]}>{user.name}</span>
          </div>
          <div className={styles["profile-field-row"]}>
            <span className={styles["profile-label"]}>Email:</span>
            <span className={styles["profile-field-value"]}>{user.email}</span>
          </div>
          <div className={styles["profile-field-row"]}>
            <span className={styles["profile-label"]}>Telegram:</span>
            {editTelegram ? (
              <>
                <input
                  className={styles["profile-edit-input"]}
                  type="text"
                  value={telegram}
                  onChange={e => setTelegram(e.target.value)}
                />
                <button onClick={saveTelegram} className={styles["profile-save-btn"]} title="Зберегти">
                  <IoSave size={22} />
                </button>
                <button
                  onClick={() => {
                    setEditTelegram(false);
                    setTelegram(user.telegram || "");
                  }}
                  className={styles["profile-cancel-btn"]}
                  title="Скасувати"
                >
                  <MdCancel size={22} />
                </button>
              </>
            ) : (
              <>
                <span className={styles["profile-field-value"]}>{user.telegram || "Не вказано"}</span>
                <button
                  className={styles["profile-edit-pencil"]}
                  onClick={() => setEditTelegram(true)}
                  title="Редагувати"
                >
                  <PencilIcon />
                </button>
              </>
            )}
          </div>
          <div className={styles["profile-field-row"]}>
            <span className={styles["profile-label"]}>Телефон:</span>
            {editPhone ? (
              <>
                <input
                  className={styles["profile-edit-input"]}
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <button onClick={savePhone} className={styles["profile-save-btn"]} title="Зберегти">
                  <IoSave size={22} />
                </button>
                <button
                  onClick={() => {
                    setEditPhone(false);
                    setPhone(user.phone || "");
                  }}
                  className={styles["profile-cancel-btn"]}
                  title="Скасувати"
                >
                  <MdCancel size={22} />
                </button>
              </>
            ) : (
              <>
                <span className={styles["profile-field-value"]}>{user.phone || "Не вказано"}</span>
                <button
                  className={styles["profile-edit-pencil"]}
                  onClick={() => setEditPhone(true)}
                  title="Редагувати"
                >
                  <PencilIcon />
                </button>
              </>
            )}
          </div>
          <div className={styles["profile-field-row"]}>
            <span className={styles["profile-label"]}>Відділ:</span>
            <span className={styles["profile-field-value"]}>{user.department || "Не вказано"}</span>
          </div>
        </div>
      </div>
      
      <button className={styles["profile-btn-dashboard"]} onClick={() => navigate("/dashboard")}>DASHBOARD</button>
      
    </div>
  );
};

export default ProfilePage;
