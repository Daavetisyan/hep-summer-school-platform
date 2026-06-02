from __future__ import annotations

from typing import Sequence


def experiment_runs_to_root(rows: Sequence, output_path: str) -> str:
    '''
    ROOT export using uproot.

    This simplified exporter focuses on detector-like events.
    It stores JSON-like fields as strings where needed, which is acceptable for MVP.
    Later, split nested detector values into numerical branches.
    '''
    try:
        import numpy as np
        import uproot
    except ImportError as exc:
        raise RuntimeError("Install uproot and numpy to enable ROOT export.") from exc

    student_id = []
    module_id = []
    simulation_type = []
    timestamp = []

    for row in rows:
        student_id.append(row.student_id)
        module_id.append(row.module_id)
        simulation_type.append(row.simulation_type)
        timestamp.append(row.timestamp.isoformat())

    with uproot.recreate(output_path) as f:
        f["experiment_runs"] = {
            "student_id": np.array(student_id, dtype="int32"),
            "module_id": np.array(module_id, dtype="int32"),
            "simulation_type": np.array(simulation_type),
            "timestamp": np.array(timestamp),
        }

    return output_path
