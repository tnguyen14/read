# Store reading lists

## List types
### `email_list`

Supported properties:

- `sharer`: *string* email address of the sharer
- `sent`: *boolean* whether the article has been shared

### `personal`

Supported properties:

- `favorite`: *boolean* whether the article is a favorite article
- `note`: *string* note associated with the article
- `status`: *string* article status, could be `TO-READ`, `READ`. Default to `READ`.

## Default properties

Each article has:

- `timestamp`: the time when the article is saved to the list
- `updatedOn`: the time when the article is last updated
