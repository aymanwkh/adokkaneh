import { useState } from 'react'
import labels from '../data/labels'
import { addCountry, getMessage } from '../data/actions'
import { IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonToast } from '@ionic/react'
import { useHistory, useLocation } from 'react-router'
import Header from './header'
import Footer from './footer'
import { checkmarkOutline } from 'ionicons/icons'
import { Country, Err, State } from '../data/types'
import { useSelector } from 'react-redux'

const CountryAdd = () => {
  const stateCountries = useSelector<State, Country[]>(state => state.countries)
  const [name, setName] = useState('')
  const [message] = useIonToast()
  const location = useLocation()
  const history = useHistory()

  const handleSubmit = () => {
    try{
      if (stateCountries.find(c => c.name === name)) {
        throw new Error('duplicateName')
      }
      addCountry({
        id: Math.random().toString(),
        name
      })
      message(labels.addSuccess, 3000)
      history.goBack()
    } catch(error) {
      const err = error as Err
			message(getMessage(location.pathname, err), 3000)
		}
  }
  return (
    <IonPage>
      <Header title={labels.addCountry} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.name}
            </IonLabel>
            <IonInput 
              value={name} 
              type="text" 
              autofocus
              clearInput
              onIonChange={e => setName(e.detail.value!)} 
            />
          </IonItem>
        </IonList>
      </IonContent>
      {name &&
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleSubmit} color="success">
            <IonIcon icon={checkmarkOutline} /> 
          </IonFabButton>
        </IonFab>    
      }
      <Footer />
    </IonPage>
  )
}
export default CountryAdd
