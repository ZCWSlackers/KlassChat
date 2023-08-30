package rocks.zipcode.klasschat.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import rocks.zipcode.klasschat.domain.Workspace;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class WorkspaceRepositoryWithBagRelationshipsImpl implements WorkspaceRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Workspace> fetchBagRelationships(Optional<Workspace> workspace) {
        return workspace.map(this::fetchUsers);
    }

    @Override
    public Page<Workspace> fetchBagRelationships(Page<Workspace> workspaces) {
        return new PageImpl<>(fetchBagRelationships(workspaces.getContent()), workspaces.getPageable(), workspaces.getTotalElements());
    }

    @Override
    public List<Workspace> fetchBagRelationships(List<Workspace> workspaces) {
        return Optional.of(workspaces).map(this::fetchUsers).orElse(Collections.emptyList());
    }

    Workspace fetchUsers(Workspace result) {
        return entityManager
            .createQuery(
                "select workspace from Workspace workspace left join fetch workspace.users where workspace is :workspace",
                Workspace.class
            )
            .setParameter("workspace", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Workspace> fetchUsers(List<Workspace> workspaces) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, workspaces.size()).forEach(index -> order.put(workspaces.get(index).getId(), index));
        List<Workspace> result = entityManager
            .createQuery(
                "select distinct workspace from Workspace workspace left join fetch workspace.users where workspace in :workspaces",
                Workspace.class
            )
            .setParameter("workspaces", workspaces)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
