import { useMemo } from 'react'
import moment from 'moment'
import 'moment/locale/ar'
import labels from '../data/labels'
import { deleteLog, getMessage } from '../data/actions'
import { Err, Log, State, Customer } from '../data/types'
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText, useIonAlert, useIonToast } from '@ionic/react'
import { useLocation } from 'react-router'
import Header from './header'
import { trashOutline } from 'ionicons/icons'
import { colors } from '../data/config'
import { useSelector } from 'react-redux'

const Logs = () => {
  const stateLogs = useSelector<State, Log[]>(state => state.logs)
  const stateCustomers = useSelector<State, Customer[]>(state => state.customers)
  const [message] = useIonToast()
  const location = useLocation()
  const [alert] = useIonAlert()
  const logs = useMemo(() => stateLogs.map(l => {
                                        const customer = stateCustomers.find(c => c.id === l.userId)
                                        return {
                                          ...l,
                                          customer
                                        }
                                      })
                                      .sort((l1, l2) => l1.time > l2.time ? -1 : 1)
  , [stateLogs, stateCustomers])
  const handleDelete = (log: Log) => {
    alert({
      header: labels.confirmationTitle,
      message: labels.confirmationText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: () => {
          try{
            deleteLog(log)
            message(labels.deleteSuccess, 3000)
          } catch(error) {
            const err = error as Err
            message(getMessage(location.pathname, err), 3000)
          }    
        }},
      ],
    })
  }
  return(
    <IonPage>
      <Header title={labels.logs} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {logs.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : logs.map(l => 
              <IonItem key={l.id}>
                <IonLabel>
                  <IonText style={{color: colors[0].name}}>{`${labels.user}: ${l.customer?.name || l.userId}`}</IonText>
                  <IonText style={{color: colors[1].name}}>{l.customer?.mobile ? `${labels.mobile}: ${l.customer.mobile}` : ''}</IonText>
                  <IonText style={{color: colors[2].name}}>{l.page}</IonText>
                  <IonText style={{color: colors[3].name}}>{l.error}</IonText>
                  <IonText style={{color: colors[4].name}}>{moment(l.time).fromNow()}</IonText>
                </IonLabel>
                <IonButtons slot="end" onClick={() => handleDelete(l)}>
                  <IonButton>
                    <IonIcon 
                      icon={trashOutline} 
                      slot="icon-only" 
                      color="danger"
                    />
                  </IonButton>
                </IonButtons>
              </IonItem>    
            )
          }
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Logs
