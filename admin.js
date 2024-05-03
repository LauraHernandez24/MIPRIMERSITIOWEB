$(document).ready(function() {
    function getUsers() {
        $.get('/users', function(data) {
            $('#userTable tbody').empty();
            data.forEach(function(user) {
                $('#userTable tbody').append(`
                    <tr>
                        <td>${user._id}</td>
                        <td>${user.Nombre_1} ${user.Apellido_1}</td>
                        <td>${user['E-mail']}</td>
                        <td>
                            <button class="btn btn-primary btn-edit" data-id="${user._id}">Editar</button>
                            <button class="btn btn-danger btn-delete" data-id="${user._id}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    getUsers();

    $('#userTable').on('click', '.btn-edit', function() {
        var userId = $(this).data('id');
        $.get(`/users/${userId}`, function(user) {
            var editForm = `
                <form id="editForm">
                    <div class="form-group">
                        <label for="editName">Nombre</label>
                        <input type="text" class="form-control" id="editName" value="${user.Nombre_1}">
                    </div>
                    <div class="form-group">
                        <label for="editEmail">Correo Electrónico</label>
                        <input type="email" class="form-control" id="editEmail" value="${user['E-mail']}">
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </form>
            `;
            $('#editModal .modal-body').html(editForm);
            $('#editModal').modal('show');
        });
    });

    $('#editModal').on('submit', '#editForm', function(e) {
        e.preventDefault();
        var userId = $('.btn-edit').data('id');
        var updatedData = {
            Nombre_1: $('#editName').val(),
            'E-mail': $('#editEmail').val()
        };
        $.ajax({
            url: `/users/${userId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function(response) {
                alert('Usuario actualizado correctamente');
                $('#editModal').modal('hide');
                getUsers();
            },
            error: function(error) {
                alert('Error al actualizar usuario');
                console.error(error);
            }
        });
    });

    $('#userTable').on('click', '.btn-delete', function() {
        var userId = $(this).data('id');
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            $.ajax({
                url: `/users/${userId}`,
                method: 'DELETE',
                success: function(response) {
                    alert('Usuario eliminado correctamente');
                    getUsers();
                },
                error: function(error) {
                    alert('Error al eliminar usuario');
                    console.error(error);
                }
            });
        }
    });
});
