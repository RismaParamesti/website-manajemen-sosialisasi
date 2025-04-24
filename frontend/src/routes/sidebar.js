/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon'

const iconClasses = `h-6 w-6`

const routes = [

  {
    path: '/app/dashboard',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Beranda',
  },

  {
    path: '', //no url needed as this has submenu
    icon: <UserGroupIcon className={`${iconClasses} inline`}/>, // icon component
    name: 'Sosialisasi', // name that appear in Sidebar
    submenu : [
      {
        path: '/app/EducationUnit',
        name: 'Satuan Pendidikan',
      },
      {
        path: '/app/HealthFacility', //url
        name: 'Fasilitas Kesehatan', // name that appear in Sidebar
      },
      {
        path: '/app/PublicHousing',
        name: 'Rusun',
      },
      {
        path: '/app/Mall',
        name: 'Mall',
      },
      {
        path: '/app/Hotel',
        name: 'Hotel',
      },
      {
        path: '/app/Office',
        name: 'Perkantoran',
      },
      {
        path: '/app/Apartement',
        name: 'Apartement',
      },
      {
        path: '/app/UrbanVillage',
        name: 'Kelurahan Tangguh',
      },
    ]
  },

  {
    path: '/app/Educations', // url
    icon: <BookOpenIcon className={iconClasses}/>, // icon component
    name: 'Materi', // name that appear in Sidebar
  },
  
]

export default routes


