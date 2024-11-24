# Tipos de usuarios

- ADM
- Cliente -> Cria do ADM
- Motorista -> ADM

# Permissões

- AMD -> Cadastra TUDO (Cliente, Motorista, Veiculo e Produto)
- CLiente -> Visualiza listagem de produtos e acompanha percurso
- Motorista -> Acompanha sua entrega atual (se tiver) e automaticamente atualiza a localização atual

# Telas

- /login
  - /adm
    - /register/client (cadastra cliente)
    - /register/vehicle (cadastra o motorista junto)
    - /register/product (cadastro das informações de produto + selecionar o ponto de entrega ou cadastrar um novo)
  - /client
    - /products (listagem de produtos)
    - /track/:id (acompanhamento de entrega)
  - /driver
    - /track (acompanhamento de entrega)
