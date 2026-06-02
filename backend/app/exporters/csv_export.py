import pandas as pd


def experiment_runs_to_csv(rows, output_path: str) -> str:
    data = []
    for row in rows:
        data.append({
            "student_id": row.student_id,
            "module_id": row.module_id,
            "simulation_type": row.simulation_type,
            "parameters_json": row.parameters_json,
            "results_json": row.results_json,
            "timestamp": row.timestamp.isoformat(),
        })

    df = pd.DataFrame(data)
    df.to_csv(output_path, index=False)
    return output_path
