/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon'

const iconClasses = `h-6 w-6`

const routes = [

  {
    path: '/adm/dashboardAdmin',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Beranda',
  },

  {
    path: '', //no url needed as this has submenu
    icon: <UserGroupIcon className={`${iconClasses} inline`}/>, // icon component
    name: 'Sosialisasi', // name that appear in Sidebar
    submenu : [
      {
        path: '/adm/EducationUnitAdmin',
        name: 'Satuan Pendidikan',
      },
      {
        path: '/adm/HealthFacilityAdmin', //url
        name: 'Fasilitas Kesehatan', // name that appear in Sidebar
      },
      {
        path: '/adm/PublicHousingAdmin',
        name: 'Rusun',
      },
      {
        path: '/adm/MallAdmin',
        name: 'Mall',
      },
      {
        path: '/adm/HotelAdmin',
        name: 'Hotel',
      },
      {
        path: '/adm/OfficeAdmin',
        name: 'Perkantoran',
      },
      {
        path: '/adm/ApartementAdmin',
        name: 'Apartemen',
      },
      {
        path: '/adm/UrbanVillageAdmin',
        name: 'Kelurahan Tangguh',
      },
    ]
  },

  {
    path: '/adm/EducationsAdmin', // url
    icon: <BookOpenIcon className={iconClasses}/>, // icon component
    name: 'Materi', // name that appear in Sidebar
  },
  
]

export default routes


