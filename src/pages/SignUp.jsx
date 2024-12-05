import { useState } from "react";
import { EyeIcon, EyeOffIcon, CheckIcon, XIcon } from "../utils/SVGExporter";
import { useNavigate } from "react-router-dom";
import { AuthEndpoint } from "../utils/EndpointExporter";
import { toast } from "react-toastify";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false); // Estado para el checkbox
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const passwordStrength = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;
    return strength;
  };

  const renderPasswordStrength = () => {
    const strength = passwordStrength(password);
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-600",
    ];
    return (
      <div className="flex mt-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 w-1/5 ${
              strength >= level ? colors[strength - 1] : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${AuthEndpoint}/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Please verify your email address");
        navigate("/login");
      } else {
        toast.error("An error has occurred");
      }
    } catch (e) {
      toast.error("Error: could not register. Check your credentials.");
      console.log(e);
    }
  };

  // Función para abrir y cerrar el modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BDD9F2]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1D2C40]">
          Sign Up
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#3D5473]"
            >
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
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[#3D5473]"
            >
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#3D5473]"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#3D5473]"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
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
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#3D5473]"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
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
                    <CheckIcon
                      className="h-5 w-5 text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <XIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
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
                I accept the{" "}
                <button
                  type="button"
                  onClick={openModal}
                  className="text-[#1D2C40] underline"
                >
                  privacy policy
                </button>
                .
              </span>
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={password !== confirmPassword || !acceptedPrivacy}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                password === confirmPassword && acceptedPrivacy
                  ? "bg-[#3D5473] hover:bg-[#2B3C55]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen w-11/12 md:w-3/4 lg:w-1/2 px-6 py-10">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-blue-700 text-center">
                  Política de Privacidad y Protección de Datos Personales
                </h1>
                <p className="text-lg mt-2">
                  Superior Mentality - Agenda Interactiva para Personas con TDAH
                </p>
                <p className="text-sm text-gray-600">
                  Última actualización: 04 de Diciembre 2024 a las 4:32 p.m
                  horas
                </p>
              </header>
              <section class="mb-10">
                <h2 class="text-xl font-semibold text-blue-600">
                  1. Responsable de los Datos Personales
                </h2>
                <p class="mt-2">
                  Superior Mentality, con domicilio en{" "}
                  <span class="italic">
                    Avenida Pie de la Cuesta 2600, 76140 Santiago de Querétaro,
                  </span>
                  , es responsable del tratamiento de sus datos personales y de
                  su protección.
                </p>
              </section>
              <section class="mb-10">
                <h2 class="text-xl font-semibold text-blue-600">
                  2. Datos Personales que Recolectamos
                </h2>
                <p class="mt-2">
                  Los datos personales que recolectamos de nuestros usuarios
                  son:
                </p>
                <ul class="list-disc pl-6 mt-2">
                  <li>Nombre completo</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Dirección IP</li>
                  <li>Datos de seguimiento de usuario</li>
                </ul>
              </section>
              <section class="mb-10">
                <h2 class="text-xl font-semibold text-blue-600">
                  3. Finalidades del Tratamiento de Datos
                </h2>
                <p class="mt-2">
                  Sus datos personales serán utilizados para las siguientes
                  finalidades:
                </p>
                <h3 class="font-semibold text-blue-500 mt-4">
                  Finalidades Primarias:
                </h3>
                <ul class="list-disc pl-6 mt-2">
                  <li>Crear y gestionar su cuenta de usuario</li>
                  <li>Proporcionar los servicios solicitados</li>
                  <li>Procesar sus solicitudes y consultas</li>
                  <li>Enviar comunicaciones relacionadas con el servicio</li>
                  <li>Mejorar la experiencia del usuario</li>
                  <li>Garantizar la seguridad de la plataforma</li>
                </ul>
                <h3 class="font-semibold text-blue-500 mt-4">
                  Finalidades Secundarias:
                </h3>
                <ul class="list-disc pl-6 mt-2">
                  <li>Enviar información sobre actualizaciones del servicio</li>
                  <li>Realizar análisis estadísticos</li>
                  <li>
                    Enviar comunicaciones promocionales (con previo
                    consentimiento)
                  </li>
                </ul>
              </section>
              <section class="mb-10">
                <h2 class="text-xl font-semibold text-blue-600">
                  4. Medidas de Seguridad
                </h2>
                <p class="mt-2">
                  Implementamos diversas medidas de seguridad técnicas,
                  administrativas y físicas para proteger sus datos personales,
                  incluyendo:
                </p>
                <ul class="list-disc pl-6 mt-2">
                  <li>Encriptación de datos sensibles</li>
                  <li>Firewalls y sistemas de seguridad</li>
                  <li>Acceso restringido a datos personales</li>
                  <li>Políticas internas de protección de datos:</li>
                  <ul class="list-decimal pl-8 m-4">
                    <li>
                      Clasificación y control de datos personales según su nivel
                      de sensibilidad.
                    </li>
                    <li>
                      Capacitación periódica del personal sobre manejo seguro de
                      datos personales.
                    </li>
                    <li>
                      Implementación de autenticación de dos factores (2FA) para
                      accesos críticos.
                    </li>
                    <li>
                      Establecimiento de plazos de retención y eliminación
                      segura de datos cuando no sean necesarios.
                    </li>
                    <li>
                      Protocolo de respuesta a incidentes de seguridad,
                      incluyendo notificaciones a los afectados.
                    </li>
                    <li>
                      Contratos con proveedores que incluyan cláusulas de
                      privacidad y evaluaciones periódicas.
                    </li>
                    <li>
                      Auditorías regulares de los sistemas que gestionen datos
                      personales.
                    </li>
                    <li>
                      Limitación de la recopilación de datos personales al
                      mínimo necesario.
                    </li>
                    <li>
                      Notificación interna sobre cambios en las políticas de
                      protección de datos.
                    </li>
                  </ul>
                  <li>Capacitación del personal en materia de privacidad</li>
                </ul>
              </section>
              <section class="mb-10">
                <h2 class="text-xl font-semibold text-blue-600">
                  5. Derechos ARCO
                </h2>
                <p class="mt-2">
                  Como usuario de Superior Mentality, tiene los siguientes
                  derechos sobre sus datos personales:
                </p>
                <h3 class="font-semibold text-blue-500 mt-4">
                  5.1 Derecho de Acceso
                </h3>
                <p class="mt-2">
                  Puede solicitar información sobre qué datos personales tenemos
                  almacenados, su uso, origen y transferencias realizadas.
                </p>
                <h3 class="font-semibold text-blue-500 mt-4">
                  5.2 Derecho de Rectificación
                </h3>
                <p class="mt-2">
                  Puede solicitar la corrección de datos desactualizados o
                  inexactos, y la actualización de su información.
                </p>
                <h3 class="font-semibold text-blue-500 mt-4">
                  5.3 Derecho de Cancelación
                </h3>
                <p class="mt-2">
                  Solicite la eliminación de sus datos cuando considere que ya
                  no son necesarios.
                </p>
                <p class="mt-2 italic">
                  Enviar solicitud a:{" "}
                  <span class="text-blue-600">support@xcodesigma.com</span>
                </p>
                <h3 class="font-semibold text-blue-500 mt-4">
                  5.4 Derecho de Oposición
                </h3>
                <p class="mt-2">
                  Oponerse al tratamiento de sus datos para fines específicos.
                </p>
              </section>
              <section class="mb-10">
                <h2 class="text-xl font-semibold text-blue-600">
                  6. Transferencias de Datos
                </h2>
                <p class="mt-2">
                  Sus datos personales pueden ser transferidos a proveedores de
                  servicios y autoridades competentes con medidas de seguridad
                  apropiadas.
                </p>
                <p className="mt-2 font-bold">
                  Los provedores actuales se reservan el tratamiento de datos
                  directamente en su manejo y posesion asegurandose de su uso
                  bajo la normativa correspondiente
                </p>
                <a
                  href="https://www.hostgator.mx/terminos"
                  className="text-blue-600 underline block"
                >
                  Terminos del Servicio
                </a>
                <a
                  href="https://www.hostgator.co/politicas-soporte"
                  className="text-blue-600 underline block"
                >
                  Politicas de Soporte
                </a>
              </section>
              <section class="mb-10">
                <h2 class="text-xl font-semibold text-blue-600">
                  7. Uso de Cookies
                </h2>
                <p class="mt-2">
                  Utilizamos cookies para mejorar su experiencia en nuestra
                  plataforma. Puede configurar su navegador para gestionarlas.
                </p>
              </section>
              <section class="mb-10">
                <h2 class="text-xl font-semibold text-blue-600">
                  8. Cambios en la Política de Privacidad
                </h2>
                <p class="mt-2">
                  Nos reservamos el derecho de modificar esta política en
                  cualquier momento, notificándolo en nuestra plataforma o por
                  correo electrónico.
                </p>
              </section>
              <section>
                <h2 class="text-xl font-semibold text-blue-600">9. Contacto</h2>
                <p class="mt-2">Para dudas, puede contactarnos en:</p>
                <ul class="list-disc pl-6 mt-2">
                  <li>
                    Correo electrónico:{" "}
                    <span class="text-blue-600">support@xcodesigma.com</span>
                  </li>
                  <li>
                    Teléfono:{" "}
                    <span class="text-blue-600">+52 442115764157</span>
                  </li>
                  <li>
                    Dirección:{" "}
                    <span class="italic">
                      Avenida Pie de la Cuesta 2600, 76140 Santiago de
                      Querétaro,
                    </span>
                  </li>
                </ul>
              </section>
              <button
                onClick={closeModal}
                className="mt-4 w-full py-2 px-4 bg-[#3D5473] hover:bg-[#2B3C55] rounded-md text-white"
              >
                Close
              </button>{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
