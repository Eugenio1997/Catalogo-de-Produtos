# Catalogo-de-Produtos
Um aplicativo da web de catálogo de produtos desenvolvido com ASP.Net Core, Angular, Bootstrap, Animate.css e Typescript.

### Os recursos do aplicativo:

#### Listagem de Produtos (Tela Inicial):

- Paginação para facilitar a navegação em um grande número de produtos.
- Um campo de filtro para permitir que os usuários busquem produtos por nome.
- Um dropdown de ordenação para ordenar os produtos por diferentes critérios, como maior e menor valor.

#### Detalhes do Produto:

- Uma tela dedicada para exibir informações detalhadas sobre um produto específico.
- Inclusão de imagens, descrição, preço e quantidade em estoque.
- Botões de ação para adicionar o produto ao carrinho ou voltar para a lista de produtos.

#### Carrinho de Compras:

- Uma página onde os usuários podem visualizar os produtos que adicionaram ao carrinho.
- Capacidade de ajustar quantidades, remover itens e visualizar o total do carrinho.
- Opção para prosseguir para o processo de checkout.


#### Revisão do Pedido:

- Uma etapa antes da conclusão da compra, onde os usuários podem revisar todos os itens escolhidos.
- Mostra nome do produto e quantidade.
- É necessário autenticar-se para acessar a tela de Revisão do Pedido.

#### Autenticação e Autorização:

- Telas de Signin (Entrar) e Signup (Registrar-se) para autenticação e registro de usuários.
- Caso o usuário não esteja autenticado e clique no botão para ir para a tela de Revisão do Pedido, ocorrerá um redirecionamento para a tela de Signin.
- A autenticação está sendo feita via Token JWT para garantir segurança.
- Uso de Refresh Token para estender a sessão de autenticação.

#### Navegação Segura:

- O acesso às telas de Detalhes do Produto e Carrinho de Compras não necessita de autenticação.
- O acesso à tela de Revisão do Pedido exige autenticação para garantir segurança.
- Mensagens ou redirecionamentos claros para orientar os usuários sobre a necessidade de autenticação.

#### Tecnologias:

- ASP.Net Core
- Angular
- Bootstrap
- Animate.css
- Typescript
