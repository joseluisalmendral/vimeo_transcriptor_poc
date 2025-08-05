// src/utils/jokes.js
export const badJokes = [
    "¿Por qué la vaca fue al espacio? Para ver la Vía Láctea.",
    "¿Qué le dice un pez a otro? Nada.",
    "¿Cómo se llama el campeón de buceo japonés? Tokofondo.",
    "¿Por qué los pájaros vuelan hacia el sur en invierno? Porque es muy lejos para caminar.",
    "¿Qué le dice un jardinero a otro? Somos los mejores en nuestro campo.",
    "¿Cómo se llama el pez que no ve? Ciego como un pez.",
    "¿Por qué los elefantes no usan computadoras? Porque tienen miedo al mouse.",
    "¿Qué hace una abeja en el gimnasio? Zum-ba.",
    "¿Cómo se despiden los químicos? Ácido un placer.",
    "¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.",
    "¿Qué le dice el número 3 al número 30? Para ser como yo, tienes que ser sincero.",
    "¿Cómo se llama el superhéroe más tonto? Captain Obvio.",
    "¿Por qué las plantas no pueden correr? Porque tienen raíces.",
    "¿Qué le dice una iguana a su hermana gemela? Somos iguanitas.",
    "¿Cómo se llama el perro mago? Labracadabrador.",
    "¿Por qué los peces no pagan impuestos? Porque viven en bancos.",
    "¿Qué hace un pez cuando está aburrido? Nada especial.",
    "¿Cómo se llama un dinosaurio que choca su auto? Tiranosaurio Rex.",
    "¿Por qué el café fue al psicólogo? Porque estaba molido.",
    "¿Qué le dice un taco a otro taco? ¿Quieres ser mi pareja... de baile?"
  ];
  
  export const getRandomJoke = () => {
    return badJokes[Math.floor(Math.random() * badJokes.length)];
  };