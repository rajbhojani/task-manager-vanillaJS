<?php
$host = 'localhost';
$db = 'task_manager';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];

    switch ($action) {
        case 'add':
            $stmt = $pdo->prepare("INSERT INTO tasks (name, status) VALUES (?, ?)");
            $stmt->execute([$_POST['name'], 'Pending']);
            $newId = $pdo->lastInsertId();
            echo json_encode(['status' => 'success', 'id' => $newId]);
            break;

        case 'edit':
            $stmt = $pdo->prepare("UPDATE tasks SET name = ? WHERE id = ?");
            $stmt->execute([$_POST['name'], $_POST['id']]);
            echo json_encode(['status' => 'success']);
            break;

        case 'update_status':
            $stmt = $pdo->prepare("UPDATE tasks SET status = ? WHERE id = ?");
            $stmt->execute([$_POST['status'], $_POST['id']]);
            echo json_encode(['status' => 'success']);
            break;

        case 'delete':
            $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            echo json_encode(['status' => 'success']);
            break;
    }
    exit;
}

$stmt = $pdo->query("SELECT * FROM tasks");
$tasks = $stmt->fetchAll();
$inProgressCount = 0;
foreach ($tasks as $task) {
    if ($task['status'] === 'In-Progress') {
        $inProgressCount++;
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Management</title>
    <link rel="stylesheet" href="styles.css" />
</head>

<body>
    <div class="main-container">
        <span class="to-do-management">To-Do Task Management</span>
        <div class="addTask <?= count($tasks) != 0 ? 'hidden' : '' ?>">
            <div class="box">
                <span class="add-task-title">Add a New Task</span>
                <input class="task-name-input" type="text" id="taskInput" placeholder="Add a new task" />
                <button id="addTask" class="addTaskButton">Add</button>
                <button id="back" class="backButton">Go Back</button>
            </div>
        </div>
        <div class="taskList <?= count($tasks) != 0 ? '' : 'hidden' ?>">
            <div class="flex-row">
                <span class="in-progress">In progress (<?= $inProgressCount ?>)</span><span class="add-new-task"><span
                        class="add"></span>Add new task</span>
            </div>
            <?php foreach ($tasks as $task): ?>
            <div class="tasklistbox" data-id="<?= $task['id'] ?>">
                <div class="view-form">
                    <span class="task-name"><?= $task['name'] ?></span>
                    <div class="actions">
                        <button class="editButton"></button>
                        <button class="deleteTask"></button>
                        <button class="more"></button>
                        <div class="dropdown-content hidden">
                            <ul class="task-status-list">
                                <li class="task-status-item <?= $task['status'] == 'Pending' ? 'selected' : '' ?>"
                                    data-status="Pending">
                                    <span class="status-text Pending">Pending</span>
                                </li>
                                <li class="task-status-item <?= $task['status'] == 'In-Progress' ? 'selected' : '' ?>"
                                    data-status="In-Progress">
                                    <span class="status-text Progress">In Progress</span>
                                </li>
                                <li class="task-status-item <?= $task['status'] == 'Completed' ? 'selected' : '' ?>"
                                    data-status="Completed">
                                    <span class="status-text Completed">Completed</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="statuspill <?= $task['status'] ?>"><span
                            class="status-text"><?= $task['status'] ?></span></div>
                </div>
                <div class="edit-form hidden">
                    <input class="task-name-input" type="text" value="<?= $task['name'] ?>" />
                    <div class="actions">
                        <button class="confirmEdit"></button>
                        <button class="cancelEdit"></button>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="script.js"></script>
</body>

</html>