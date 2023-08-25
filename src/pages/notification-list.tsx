import { useMemo } from 'react'
import labels from '../data/labels'
import moment from 'moment'
import 'moment/locale/ar'
import { deleteNotification, getMessage } from '../data/actions'
import { Err, Notification, State, Customer } from '../data/types'
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import Footer from './footer'
import { useLocation } from 'react-router'
import { colors } from '../data/config'
import { addOutline, trashOutline } from 'ionicons/icons'
import { useSelector } from 'react-redux'
import firebase from '../data/firebase'

const NotificationList = () => {
  const stateUser = useSelector<State, firebase.User | undefined>(state => state.user)
  const stateNotifications = useSelector<State, Notification[]>(state => state.notifications)
  const stateCustomers = useSelector<State, Customer[]>(state => state.customers)
  const location = useLocation()
  const [message] = useIonToast()
  const [alert] = useIonAlert()
  const notifications = useMemo(() => stateNotifications.map(n => {
                                                          const customer = stateCustomers.find(c => c.id === n.userId)!
                                                          return {
                                                            ...n,
                                                            customer
                                                          }
                                                        })
                                                        .sort((n1, n2) => n2.time > n1.time ? 1 : -1)
  , [stateCustomers, stateNotifications])
  const handleDelete = (notificationId: string) => {
    alert({
      header: labels.confirmationTitle,
      message: labels.confirmationText,
      buttons: [
        {text: labels.cancel},
        {text: labels.yes, handler: () => {
          try{
            const notification = stateNotifications.find(n => n.id === notificationId)!
            deleteNotification(notification, stateNotifications)
            message(labels.deleteSuccess, 3000)
          } catch(error) {
            const err = error as Err
            message(getMessage(location.pathname, err), 3000)
          }    
        }},
      ],
    })
  }

  if (!stateUser) return <IonPage><h3 className="center"><a href="/login/">{labels.relogin}</a></h3></IonPage>
  return (
    <IonPage>
      <Header title={labels.notifications} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {notifications.length === 0 ? 
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : notifications.map(n =>
              <IonItem key={n.id}>
                <IonLabel>
                  <IonText style={{color: colors[0].name}}>{`${n.customer.name}:${n.customer.mobile}`}</IonText>
                  <IonText style={{color: colors[1].name}}>{n.title}</IonText>
                  <IonText style={{color: colors[2].name}}><p>{n.text}</p></IonText>
                  <IonText style={{color: colors[3].name}}>{n.status === 'n' ? labels.notRead : labels.read}</IonText>
                  <IonText style={{color: colors[4].name}}>{moment(n.time).fromNow()}</IonText>
                </IonLabel>
                <IonButtons slot="end" onClick={() => handleDelete(n.id)}>
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
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton routerLink="/notification-add" color="success">
          <IonIcon icon={addOutline} /> 
        </IonFabButton>
      </IonFab>
      <Footer />
    </IonPage>
  )
}

export default NotificationList
