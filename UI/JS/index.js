
const fs = require('fs')
const path = require('path')
const {dialog} = require('electron').remote
const pyshell = require('python-shell')
const swall = require('sweetalert')

$(function () {
    let _folder = ''

    //change extension
    $('#extension').change(()=>{
        filter_files()
        if ($('#select_folder').val() !== 'choose folder'){
            let dir = $('#select_folder').val()
            fetch_files(dir)
        }
    })

    //rename or delete
    $('#action').change(()=>{
        let action = $('#action').val()
        switch (action) {
            case 'delete':
                $('#rename-header').hide()
                break
            case 'rename':
                $('#rename-header').show()
        }
    })

    $('#select_folder').click(()=>{
        let folder = dialog.showOpenDialog({
            properties: ['openDirectory'],
        }, (dir)=>{
            let directory = dir[0]
            fetch_files(directory)
        })
    })

    $('#go').click(()=>{

        let action = $('#action').val()
        let extension = $('#extension').val()
        let name = $('#name').val()

        if (_folder === '' || _folder === null || _folder.length < 1){
            //alert('Please choose a folder')
            swal("Error", "Please choose a folder", "error");
            return
        }

        if (action === 'rename' && name.replace(/ /g,'') === '' || name === null ){
            //alert('Name is required')
            swal("Error", "Name is required", "error");
            $('#name').focus()
            return
        }

        //data to send to python side
        let data = {
            'folder': _folder,
            'action': action,
            'extension': extension,
            'name': name,
        }

        //options for sending data
        let options = {
            mode: 'text',
            encoding: 'utf8',
            pythonOptions: ['-u'],
            scriptPath: 'C:\\Users\\Fii\\Desktop\\file renamer\\backend',
            pythonPath: 'C:\\Users\\Fii\\AppData\\Local\\Programs\\Python\\Python37\\python.exe',
            args: [JSON.stringify(data)],
        }






        swal({
              title: "Are you sure?",
              text: "Are you sure you want to perform this action ?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
        })
            .then((proceed) => {
                if (proceed) {

                    //initialize python-shell
                    let sendData = new pyshell('backend.py', options)

                    //receive responds
                    sendData.on('message', message=> {
                        let result = JSON.parse(message)
                        if (result['message'] === 'success') {
                            let  action = $('#action').val()
                            switch (action) {
                                case 'rename':
                                    swal("Files renamed successfully", {
                                        icon: "success",
                                        }
                                    )
                                    break
                                case 'delete':
                                    swal("Files deleted successfully", {
                                            icon: "success",
                                        }
                                    )
                                    break
                            }
                            //alert('Done...!')
                            let dir = $('#select_folder').val()
                            fetch_files(dir)
                        }
                    })

                    //log error if exist
                    sendData.end(function (err) {
                        if (err) throw err;
                    })
                }
                else {

              }
        });

    })

    function filter_files() {
        $("#list-container li").filter(function() {
            let selected_extension = $('#extension').val()
            let file = $(this).text().toLowerCase()
            let extension = path.extname(file).toLowerCase()
            $(this).toggle(extension.indexOf(selected_extension) > -1)
        }).toggle();
    }
    function fetch_files(dir) {
        $('#list-container').empty()
            $('#select_folder').val(dir)
            _folder = dir
            let num_of_files = 0
            fs.readdirSync(dir).forEach(file=>{
                let extension = path.extname(file).toLowerCase()
                let ext = $('#extension').val()
                if (extension === ext) {
                    num_of_files += 1
                    let container = $('#list-container')
                    container.append(
                        '<li class="mb-1 col-12 file-name">'+file+'</li>'
                    )
                }
            })
            $('#num_of_files').html(num_of_files)
    }

})