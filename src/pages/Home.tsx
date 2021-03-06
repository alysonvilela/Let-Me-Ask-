import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleLogo from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { Button } from '../components/button';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState('');
  const { user, signInWithGoogle } = useAuth();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('A sala expirou.');
      return;
    }
    history.push(`rooms/${roomCode}`);
  }

  return (
    <>
      <div id="page-auth">
        <aside>
          <img
            src={illustrationImg}
            alt="Ilustração simbolizando perguntas e respostas"
          />
          <strong>Crie salas Q&amp;A ao-vivo</strong>
          <p>Tire as dúvidas da sua audiência em tempo-real.</p>
        </aside>
        <main>
          <div className="main-content">
            <img src={logoImg} alt="askMe" />
            <button onClick={handleCreateRoom} className="create-room">
              <img src={googleLogo} alt="Logo do Google" />
              Crie sua sala com o Google
            </button>
            <div className="separator">ou entre em uma sala</div>
            <form onSubmit={handleJoinRoom}>
              <input
                type="text"
                placeholder="Digite o código da sala"
                onChange={(event) => setRoomCode(event.target.value)}
                value={roomCode}
              />
              <Button type="submit">Entrar na sala</Button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
