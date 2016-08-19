$(document).ready(function()
{
    var $change = $('#change');
    var $confirmPassword = $('#confirmPassword');
    $change.submit(function()
    {
        var formArray = $change.serializeArray();
        var np;
        var cnp;
        var submitForm = true;
        var alertStr = '';
        for (var i=0; i<formArray.length; i++)
        {
            switch (formArray[i].name)
            {
                case 'pw':
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'Current password is empty\n';
                    }
                    break;
                case 'np':
                    np = formArray[i].value;
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'New password is empty\n';
                    }
                    else if (!formArray[i].value.match(/^[\w~!@#$%^&*()\-+=]{8,20}$/))
                    {
                        submitForm = false;
                        alertStr += 'Password needs to be 8-20 characters, and contains only numbers, letters, and special characters\n';
                    }
                    break;
                case 'cnp':
                    cnp = formArray[i].value;
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'Confirm new password is empty\n';
                    }
                    break;
            }
        } 
        if (np !== cnp)
        {
            submitForm = false;
            alertStr += 'New password and confirm new password are not equal\n';
        }
        if (!submitForm)
        {
            alertStr = alertStr.replace(/\n$/, '');
            alert(alertStr);
            return false;
        }
        $confirmPassword.attr('name','');
        return true;
    });
});
