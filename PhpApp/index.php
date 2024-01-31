<?php
$dados = file_get_contents('http://app:3000/produtos');
$dados = json_decode($dados, true);

foreach ($dados as $produto) {
    echo $produto['nome'] . ' - ' . $produto['valor'] . '<br>';
}
?>
