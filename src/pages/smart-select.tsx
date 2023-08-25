import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react'
import { useMemo, useState } from 'react'
import labels from '../data/labels'
import Fuse from "fuse.js"
import { chevronForwardOutline, closeOutline } from 'ionicons/icons'

type Element = {
  id?: string,
  name: string
}
type Props = {
  label: string,
  data: Element[],
  value?: string,
  onChange: (v: string) => void
}
const SmartSelect = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(props.data.find(i => i.id === props.value)?.name)
  const [searchText, setSearchText] = useState('')
  const values = useMemo(() => {
    if (!searchText) {
      return props.data
    }
    const options = {
      includeScore: true,
      findAllMatches: true,
      threshold: 0.1,
      keys: ['name']
    }
    const fuse = new Fuse(props.data, options)
    const result = fuse.search(searchText)
    return result.map(p => p.item)
  }, [searchText, props.data])

  const handleSelect = (i: Element | null) => {
    setValue(i?.name || '')
    setIsOpen(false)
    props.onChange(i?.id || '')
  }
  return (
    <>
      <IonModal isOpen={isOpen} animated mode="ios">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setIsOpen(false)}>
                <IonIcon
                  icon={chevronForwardOutline} 
                />
              </IonButton>
            </IonButtons>
            <IonTitle>{props.label}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => handleSelect(null)}>
                <IonIcon
                  icon={closeOutline} 
                />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
          <IonSearchbar
            placeholder={labels.search} 
            value={searchText} 
            onIonChange={e => setSearchText(e.detail.value!)}
          />
        </IonToolbar>

        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonList>
            {values.map(i => 
              <IonItem key={i.id} detail onClick={() => handleSelect(i)}>
                <IonLabel>{i.name}</IonLabel>
              </IonItem>
            )}
          </IonList>
        </IonContent>
      </IonModal>
      <IonItem>
        <IonLabel position="floating" color="primary">
          {props.label + "🔍"}
        </IonLabel>
        <IonInput 
          value={value} 
          type="text" 
          onIonFocus={() => setIsOpen(true)} 
        />
      </IonItem>
    </>
  )
}

export default SmartSelect