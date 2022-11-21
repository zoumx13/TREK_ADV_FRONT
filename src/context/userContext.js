import { createContext, useState, useEffect } from "react";

export const userContext = createContext(
  { identifiant: "", setIdentifiant: () => {} },
  { role: "", setRole: () => {} },
  { nom: "", setNom: () => {} },
  { prenom: "", setPrenom: () => {} },
  { description: "", setDescription: () => {}},
  { profilePicture: "", setProfilePicture: () => {} },
  { annees_exp: "", setAnnees_exp: () => {} }

);

export default function UserProvider(props) {
  const [identifiant, setIdentifiant] = useState("");
  const [role, setRole] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [description,setDescription] = useState("");
  const [annees_exp,setAnnees_exp] = useState("")


  useEffect(() => {
    async function getUser() {
      const token = localStorage.getItem("token");
      const url = "http://localhost:8080/users/user";
      const options = {
        method: "GET",
        headers: {
          Authorization: "bearer " + token,
        },
      };
      const response = await fetch(url, options);

      let result = await response.json();

      console.log(result);

      if (result.profil.identifiant) {
        console.log("RESULT ",result);
        setIdentifiant(result.profil.identifiant);
        setRole(result.profil.role);
        setNom(result.profil.nom);
        setPrenom(result.profil.prenom);
        setProfilePicture(result.profil.photo_profil);
        setDescription(result.profil.description);
        setAnnees_exp(result.profil.annees_exp);
      } else {
        console.log(result);
      }
    }

    getUser();
  }, [identifiant, role]);

  return (
    <userContext.Provider
      value={{
        identifiant,
        setIdentifiant,
        role,
        setRole,
        nom,
        setNom,
        prenom,
        setPrenom,
        profilePicture,
        setProfilePicture,
        description,
        setDescription,
        annees_exp,
        setAnnees_exp
      }}
    >
      {props.children}{" "}
    </userContext.Provider>
  );
}
