

document.addEventListener('DOMContentLoaded', function() {
    const deleteForm = document.getElementById('deactive');

    if (deleteForm) {
        deleteForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío del formulario por defecto
            
            const confirmation = window.confirm('Desactivar significa que todo su contenido dejará de ser visible en el sitio. Pero siempre podrás acceder a tu contenido con tu usuario y contraseña. incluso podras reactivar la cuenta cuando lo desees');

            if (confirmation) {
                // Si el usuario confirmó, procede a enviar el formulario
                deleteForm.submit();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const activeForm = document.getElementById('active');
    const toastContainer = document.getElementById('toast-container');

    if (activeForm) {
        const activeButton = activeForm.querySelector('#activo');

        activeButton.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Simulamos una demora de 2 segundos (2000 ms) para mostrar el mensaje "toast"
            showToast();

            // Envía el formulario después de la simulación de la activación
            setTimeout(function() {
                activeForm.submit();
            }, 1000);
        });
    }

    function showToast() {
        toastContainer.style.display = 'block';

        setTimeout(function () {
            toastContainer.style.display = 'none';
        }, 1000); // El toast se ocultará después de 2 segundos (2000 ms)
    }
});