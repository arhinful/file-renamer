import os
import sys
import json

os_folder = os
default_name = ''


def rename_files(folder_path, extension, new_name):
    os_folder.chdir(folder_path)
    count = 1
    success = False
    for file in os_folder.listdir():
        file_name, file_extension = os_folder.path.splitext(file)
        if file_extension == extension:
            name_to_give = new_name + str(count) + file_extension
            os_folder.rename(file, name_to_give)
            count = int(count) + 1
            success = True
    return success

def delete_files(folder_path, extension):
    os_folder.chdir(folder_path)
    success = False
    for file in os_folder.listdir():
        file_name, file_extension = os_folder.path.splitext(file)
        if file_extension == extension:
            os_folder.remove(file)
            success = True
    return success

if __name__ == "__main__":
    raw_data = sys.argv[1]
    data = eval(raw_data)

    # initialize variables
    folder = data['folder']
    action = data['action']
    extension = data['extension']
    name = data['name']
    # folder = folder[2:]

    # rename files
    if action == 'rename':
        rename = rename_files(folder, extension, name)
        if rename:
            message = {'message': 'success'}
            print(json.dumps(message))

    # delete files
    elif action == 'delete':
        delete = delete_files(folder, extension)
        message = {'message': 'success'}
        print(json.dumps(message))


