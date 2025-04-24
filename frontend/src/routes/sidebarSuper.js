/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon'

const iconClasses = `h-6 w-6`

const routes = [

  {
    path: '/spr/dashboardSuper',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Beranda',
  },

  {
    path: '/spr/createAdmin', // url
    icon: <BookOpenIcon className={iconClasses}/>, // icon component
    name: 'Tambah Admin', // name that appear in Sidebar
  },
  
]

export default routes


