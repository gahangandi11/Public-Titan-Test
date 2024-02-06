// CountySearch.tsx
import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonToolbar,
  IonButtons,
  IonButton,
  IonRow,
  IonText,
  IonHeader,
  IonTitle,
} from "@ionic/react";
import { countiesWithAlias as countiesMO } from "../../assets/counties"; // Adjust the path accordingly

interface CountySearchProps {
  isOpen: boolean;
  counties: { name: string; value: string[] };
  setCounties: (counties: { name: string; value: string[] }) => void;
  onClose: () => void;
  onItemSelected: (selectedCounty: { name: string; value: string[] }) => void;

}

const CountySearch: React.FC<CountySearchProps> = (
  props: CountySearchProps
) => {

  const [isOpen, setIsOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e: CustomEvent) => {
    setSearchText(e.detail.value);
  };

  const handleItemClick = (selectedCounty: { name: string; value: string[] }) => {
    props.onItemSelected(selectedCounty);
    props.onClose();
  };

  const handleSearch = () => {
    console.log("Searching for:", searchText);
  };

  const filteredCounties = countiesMO.filter((county) =>
    county.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    // Update local state when the parent component's isOpen prop changes
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={props.onClose}>
      {/* <IonSearchbar value={searchText} onIonChange={handleSearchChange} placeholder="Search for a county" /> */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select County</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonList style={{ '--ion-background-color': 'white' }}>
          {filteredCounties.map((county) => (
            <IonItem  key={county.name} onClick={() => handleItemClick(county)}>
              <div>{county.name}</div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default CountySearch;
