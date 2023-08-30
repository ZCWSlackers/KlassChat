package rocks.zipcode.klasschat.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import rocks.zipcode.klasschat.domain.Workspace;

public interface WorkspaceRepositoryWithBagRelationships {
    Optional<Workspace> fetchBagRelationships(Optional<Workspace> workspace);

    List<Workspace> fetchBagRelationships(List<Workspace> workspaces);

    Page<Workspace> fetchBagRelationships(Page<Workspace> workspaces);
}
