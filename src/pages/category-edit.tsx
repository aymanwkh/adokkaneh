import { useState, useEffect, useRef, useMemo } from 'react'
import { editCategory, getMessage, deleteCategory } from '../data/actions'
import labels from '../data/labels'
import { IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonAlert, useIonToast } from '@ionic/react'
import { useHistory, useLocation, useParams } from 'react-router'
import Header from './header'
import Footer from './footer'
import { checkmarkOutline, chevronDownOutline, trashOutline } from 'ionicons/icons'
import { Category, Err, State } from '../data/types'
import { useSelector } from 'react-redux'
import SmartSelect from './smart-select'

type Params = {
  id: string
}
const CategoryEdit = () => {
  const params = useParams<Params>()
  const stateCategories = useSelector<State, Category[]>(state => state.categories)
  const [category] = useState(() => stateCategories.find(c => c.id === params.id)!)
  const [name, setName] = useState(category.name)
  const [ordering, setOrdering] = useState(category.ordering.toString())
  const [parentId, setParentId] = useState(category.parentId)
  const parentCategories = useMemo(() => stateCategories.filter(c => c.level === 1), [stateCategories])
  const [message] = useIonToast()
  const location = useLocation()
  const history = useHistory()
  const [alert] = useIonAlert()
  const fabList = useRef<HTMLIonFabElement | null>(null)
  const hasChanged= useMemo(() => (name !== category.name) || (+ordering !== category.ordering), [category, name, ordering])
  useEffect(() => {
    if (hasChanged && fabList.current) fabList.current!.close()
  }, [hasChanged])

  const handleEdit = () => {
    try{
      const newCategory = {
        ...category,
        name,
        ordering: +ordering,
        parentId,
        level: parentId ? 2 : 1
      }
      editCategory(newCategory, stateCategories)
      message(labels.editSuccess, 3000)
      history.goBack()
    } catch(error) {
      const err = error as Err
			message(getMessage(location.pathname, err), 3000)
		}
  }
  const handleDelete = () => {
    alert({
      header: labels.confirmationTitle,
      message: labels.confirmationText,
      buttons: [
        {text: labels.cancel},
        {text: labels.yes, handler: () => {
          try{
            deleteCategory(category.id, stateCategories)
            message(labels.deleteSuccess, 3000)
            history.goBack()
          } catch(error) {
            const err = error as Err
            message(getMessage(location.pathname, err), 3000)
          }    
        }},
      ],
    })

  }
  return (
    <IonPage>
      <Header title={labels.editCategory} />
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
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.ordering}
            </IonLabel>
            <IonInput 
              value={ordering} 
              type="number" 
              clearInput
              onIonChange={e => setOrdering(e.detail.value!)} 
            />
          </IonItem>
          <SmartSelect label={labels.parentCategory} data={parentCategories} value={parentId} onChange={(v) => setParentId(v)} />
        </IonList>
      </IonContent>
      <IonFab horizontal="end" vertical="top" slot="fixed" ref={fabList}>
        <IonFabButton>
          <IonIcon icon={chevronDownOutline} />
        </IonFabButton>
        <IonFabList>
          <IonFabButton color="danger" onClick={handleDelete}>
            <IonIcon icon={trashOutline} />
          </IonFabButton>
        </IonFabList>
          {name && ordering && hasChanged &&
            <IonFabButton color="success" onClick={handleEdit}>
              <IonIcon icon={checkmarkOutline} />
            </IonFabButton>
          }
      </IonFab>
      <Footer />
    </IonPage>
  )
}
export default CategoryEdit
