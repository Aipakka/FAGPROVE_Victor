import ClientIndex from './client';
import bcrypt from "bcrypt"
import SQL from '@/lib/sql';
async function CreateAdmin() {
  "use server"
  const userName = 'admin';
  const passwordHash = await bcrypt.hash('Password01', await bcrypt.genSalt());
  const admin = true;
  return await SQL.LagBruker(userName, passwordHash, admin)
}
export default function Home() {

  return (<ClientIndex tempCreateAdmin={CreateAdmin} />
  );
}
