import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
