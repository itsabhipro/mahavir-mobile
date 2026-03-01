import AuthButton from '../auth/authButton';
import AdminTopNav from './adminTopNavigationLinks';

export default function AdminNavigation() {
  return (
    <nav className="flex flex-row justify-between items-center px-2"> 
    
        {/* Navition links */}
         <div>
            <AdminTopNav />
        </div>   
        {/* {Authentication links} */}
        <div>
            <AuthButton />
        </div>
     </nav>
  );
}