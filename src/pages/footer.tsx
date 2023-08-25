import { useMemo } from 'react'
import { IonBadge, IonButton, IonButtons, IonFooter, IonIcon, IonToolbar } from '@ionic/react'
import { cartOutline, homeOutline } from 'ionicons/icons'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { Basket, State } from '../data/types'

const Footer = () => {
  const stateBasket = useSelector<State, Basket | undefined>(state => state.basket)
  const basketLink = useMemo(() => stateBasket ? '/basket' : '', [stateBasket])
  const basketCount = useMemo(() => stateBasket?.packs?.length || 0, [stateBasket])
  const history = useHistory()
  return (
    <IonFooter>
      <IonToolbar>
        <IonButtons slot="start" onClick={() => history.push('/')}>
          <IonButton>
            <IonIcon 
              icon={homeOutline}
              slot="icon-only" 
              // style={{fontSize: '20px', marginRight: '10px'}} 
            />
          </IonButton>
        </IonButtons>
        <IonButtons slot="end" onClick={() => {if (basketCount > 0) history.push(basketLink)}}>
          {basketCount > 0 && <IonBadge className="badge" style={{right: '10px'}}>{basketCount}</IonBadge>}
          <IonButton>
            <IonIcon 
              icon={cartOutline} 
              slot="icon-only"
              // style={{fontSize: '25px', marginLeft: '10px'}} 
            />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  )
}

export default Footer