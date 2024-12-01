import { useState } from 'react';
import { EyeIcon, EyeOffIcon, CheckIcon, XIcon } from "../utils/SVGExporter";
import { useNavigate } from 'react-router-dom';
import { AuthEndpoint } from '../utils/EndpointExporter';
import { toast } from 'react-toastify';

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [form, setForm] = useState({name: '', lastName: '', email: '', password: ''});
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false); // Estado para el checkbox
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const passwordStrength = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
    return strength;
  }

  const renderPasswordStrength = () => {
    const strength = passwordStrength(password);
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    return (
      <div className="flex mt-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 w-1/5 ${strength >= level ? colors[strength - 1] : 'bg-gray-300'}`}
          />
        ))}
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${AuthEndpoint}/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Please verify your email address')
        navigate('/login');
      } else {
        toast.error('An error has occurred');
      }
    } catch (e) {
      toast.error('Error: could not register. Check your credentials.');
      console.log(e);
    }
  };

  // Función para abrir y cerrar el modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BDD9F2]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1D2C40]">Sign Up</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#3D5473]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
              placeholder="Put your name.."
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[#3D5473]">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
              placeholder="Put your lastname"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#3D5473]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#3D5473]">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                className="block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setForm({ ...form, [e.target.name]: e.target.value });
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6581A6] hover:text-[#3D5473]"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {renderPasswordStrength()}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#3D5473]">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                required
                className="block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {password && confirmPassword && (
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {password === confirmPassword ? (
                    <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                  ) : (
                    <XIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="form-checkbox text-[#3D5473] h-4 w-4"
              />
              <span className="ml-2 text-sm text-[#3D5473]">
                I accept the{' '}
                <button type="button" onClick={openModal} className="text-[#1D2C40] underline">
                  privacy policy
                </button>.
              </span>
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={password !== confirmPassword || !acceptedPrivacy}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                password === confirmPassword && acceptedPrivacy
                  ? 'bg-[#3D5473] hover:bg-[#2B3C55]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
              <div className="bg-white p-6 rounded-lg w-96 max-w-full overflow-auto max-h-[80vh]">
                <h2 className="text-xl font-semibold mb-4 text-center">AVISO DE PRIVACIDAD</h2>
                <p><strong>(Conforme a la normativa ISO 27001)</strong></p>
                <p>
                  El presente Aviso de Privacidad tiene como objetivo informar a nuestros usuarios sobre el tratamiento, protección y manejo de los datos personales proporcionados durante el uso de nuestra aplicación. Este documento cumple con las mejores prácticas de seguridad y gestión de información conforme a la normativa ISO 27001, garantizando la integridad, confidencialidad y disponibilidad de los datos personales.
                </p>
                <p><strong>2. Datos Personales Tratados</strong></p>
                <p>
                  Recolectamos y utilizamos los siguientes datos personales con el propósito de brindar un servicio seguro, eficiente y personalizado:
                </p>
                <ul>
                  <li>Nombre completo.</li>
                  <li>Correo electrónico.</li>
                </ul>
                <p>
                  Estos datos son tratados con estricta confidencialidad y sólo para los fines descritos en este documento.
                </p>
                <p><strong>3. Protección de Datos Personales</strong></p>
                <p><strong>3.1 Medidas de seguridad</strong></p>
                <p>
                  Nos comprometemos a proteger los datos personales utilizando medidas técnicas y organizativas alineadas con la norma ISO 27001. Estas incluyen:
                </p>
                <ul>
                  <li>Cifrado de contraseñas. Utilizamos el algoritmo Bcrypt con un round de 10 vueltas para garantizar la seguridad del hash de las contraseñas. Este enfoque hace extremadamente difícil que terceros no autorizados puedan romper el cifrado.</li>
                  <li>Control de acceso. Limitamos el acceso a los datos personales a personal autorizado, garantizando que sólo aquellos que necesiten la información para llevar a cabo sus funciones puedan acceder a ella.</li>
                </ul>
                <p><strong>3.2 Protección de la ubicación aproximada</strong></p>
                <p>
                  La ubicación aproximada proporcionada por el usuario es almacenada y tratada con fines estadísticos y operativos, asegurando que los datos no permitan la identificación exacta de un usuario.
                </p>
                <p><strong>4. Uso de Datos y Métricas</strong></p>
                <p>
                  Con el fin de mejorar continuamente nuestro servicio y ofrecer una experiencia optimizada, utilizamos las métricas relacionadas con el uso de la aplicación, incluyendo:
                </p>
                <ul>
                  <li>Tiempo de uso y frecuencia de acceso.</li>
                  <li>Opiniones proporcionadas por los usuarios.</li>
                </ul>
                <p>
                  Estos datos serán tratados de forma agregada y anónima siempre que sea posible, respetando la privacidad de nuestros usuarios.
                </p>
                <p><strong>5. Manipulación de Datos por Terceros</strong></p>
                <p>
                  Para la gestión técnica de nuestra infraestructura y la prestación del servicio, colaboramos con los siguientes proveedores externos:
                </p>
                <ul>
                  <li>HostGator: Gestión de servidores y almacenamiento en la nube.</li>
                  <li>Vercel: Plataforma de despliegue y operación de aplicaciones.</li>
                </ul>
                <p>
                  Ambos proveedores operan bajo estrictos contratos de confidencialidad y alineación con estándares de seguridad. Nos aseguramos de que cumplan con las mejores prácticas y normativas internacionales para proteger los datos personales.
                </p>
                <p><strong>6. Derechos del Usuario</strong></p>
                <p>
                  Los usuarios tienen derecho a:
                </p>
                <ul>
                  <li>Acceder, rectificar o cancelar sus datos personales en cualquier momento.</li>
                  <li>Oponerse al uso de sus datos personales para fines no descritos en este aviso.</li>
                  <li>Solicitar la limitación del tratamiento de sus datos cuando proceda.</li>
                </ul>
                <p>
                  Para ejercer cualquiera de estos derechos, favor de contactarnos a través de nuestro correo electrónico de soporte.
                </p>
                <p><strong>7. Actualizaciones del Aviso de Privacidad</strong></p>
                <p>
                  Nos reservamos el derecho de actualizar este Aviso de Privacidad para reflejar cambios en nuestras prácticas de tratamiento de datos. En caso de realizar modificaciones significativas, notificaremos a nuestros usuarios a través de los medios de contacto proporcionados.
                </p>
                <p><strong>8. Contacto</strong></p>
                <p>
                  Si tiene alguna pregunta sobre este Aviso de Privacidad o desea ejercer alguno de sus derechos, puede comunicarse con nuestro equipo a través de:
                </p>
                <p>
                  Correo electrónico:
                </p>
                <p>
                  Agradecemos su confianza y trabajamos constantemente para garantizar que sus datos estén protegidos conforme a las mejores prácticas internacionales.
                </p>
                <p><strong>Última actualización:</strong> 15 de noviembre de 2024.</p>
                <button
                  onClick={closeModal}
                  className="mt-4 w-full py-2 px-4 bg-[#3D5473] hover:bg-[#2B3C55] rounded-md text-white"
                >
                  Close
                </button>
              </div>

            </div>
          )}

      </div>
    </div>
  );
}
